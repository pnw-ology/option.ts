
/* Interop with space-lift */
export interface Wrapper<A> {
  value(): A
}

export interface Option<A> {
  /**
   * Returns the value contained in this Option.
   * This will always return undefined if this Option instance is None.
   */
  (): A | undefined

  /**
   * Returns whether this Option has a defined value (i.e, it's a Some(value))
   */
  isDefined(): this is Some<A>

  /**
   * Maps the value contained in this Some, else returns None.
   * Depending on the map function return value, a Some could be tranformed into a None.
   */
  map<B>(fn: (a: A) => B | null | undefined | Wrapper<B>): Option<B>

  /**
   * Maps the value contained in this Some to a new Option, else returns None.
   */
  flatMap<B>(fn: (a: A) => Option<B>): Option<B>

  /**
   * If this Option is a Some and the predicate returns true, keep that Some.
   * In all other cases, return None.
   */
  filter(fn: (a: A) => boolean): Option<A>

  /**
   * Returns this Option unless it's a None, in which case the provided alternative is returned
   */
  orElse(alternative: () => Option<A>): Option<A>

  /**
   * Returns this Option's value if it's a Some, else return the provided alternative
   */
  getOrElse(alternative: A): A

  /**
   * Returns the result of calling Some(value) if this is a Some, else returns the result of calling None()
   */
  match<B, C>(matcher: { Some: (value: A) => B, None: () => C }): B | C

  toString(): string
}

export interface Some<T> extends Option<T> {
  _isSome: Some<T> // Nominal interface marker
  (): T
}

export interface None extends Option<any> {
  _isNone: None // Nominal interface marker
  (): undefined
}


export const None = makeNone()


export type NullableValue<T> = T | Option<T> | null | undefined

export interface OptionObject {
  /**
   * Creates an Option from a value.
   * If the value is null or undefined, it will create a None, else a Some.
   */
  <T>(value: T | null | undefined): Option<T>

  /**
   * Returns whether the passed value is an Option (either a Some or a None).
   */
  isOption(value: any): value is Option<{}>

  /**
   * Creates a new Option holding the tuple of all the passed values if they were all Some or non null/undefined values,
   * else returns None
   */
  all<T1, T2>(t1: NullableValue<T1>, t2: NullableValue<T2>): Option<[T1, T2]>
  all<T1, T2, T3>(t1: NullableValue<T1>, t2: NullableValue<T2>, t3: NullableValue<T3>): Option<[T1, T2, T3]>
  all<T1, T2, T3, T4>(t1: NullableValue<T1>, t2: NullableValue<T2>, t3: NullableValue<T3>, t4: NullableValue<T4>): Option<[T1, T2, T3, T4]>
  all<T1, T2, T3, T4, T5>(t1: NullableValue<T1>, t2: NullableValue<T2>, t3: NullableValue<T3>, t4: NullableValue<T4>, t5: NullableValue<T5>): Option<[T1, T2, T3, T4, T5]>
}

// The Option constructor / static object
const OptionObject = function OptionObject<T>(value: T): Option<T> {
  return isDef(value) ? Some(value) : None
} as OptionObject

OptionObject.all = (...args: any[]): any => {
  const values: any[] = []

  for (let i = 0; i < args.length; i++) {
    let value = args[i]
    if (value && (value._isSome || value._isNone)) value = value()
    if (!isDef(value)) break
    values.push(value)
  }

  if (values.length !== args.length) return None

  return Option(values)
}

OptionObject.isOption = function(value: any): value is Option<{}> {
  return (typeof value === 'function') && ('_isSome' in value || '_isNone' in value)
}


export const Option = OptionObject


function makeNone() {
  const self: any = () => undefined

  function returnNone() { return None }

  self.isDefined = () => false
  self._isNone = self
  self.map = returnNone
  self.flatMap = returnNone
  self.filter = returnNone
  self.orElse = (alt: Function) => alt()
  self.getOrElse = (alt: any) => alt
  self.match = (matcher: any) => matcher.None()
  self.toString = () => 'None'
  self.toJSON = () => null

  return self as None
}

function Some<T>(value: T) {
  const self: any = () => value
  self.value = value
  self._isSome = self

  for (let key in someProto) {
    self[key] = someProto[key]
  }

  return self as Some<T>
}

const someProto = {

  isDefined: function() {
    return true
  },

  map: function(fn: any): any {
    let result = fn(this.value)
    if (result && result['_isLiftWrapper']) result = result.value()
    if (isDef(result)) return Some(result)
    else return None
  },

  flatMap: function(fn: any) {
    return fn(this.value)
  },

  filter: function(fn: any) {
    return fn(this.value) ? this : None
  },

  orElse: function() {
    return this
  },

  getOrElse: function() {
    return this.value
  },

  match: function(matcher: any) {
    return matcher.Some(this.value)
  },

  toString: function() {
    return `Some(${this.value})`
  },

  toJSON: function() {
    return this()
  }
}

function isDef(value: any) {
  return value !== null && value !== undefined
}
