# :warning: This repo has been moved to [space-lift](https://github.com/AlexGalays/spacelift#option)  :warning:
You can continue to use Option exclusively by importing it with `import { Option, Some, None } from 'space-lift/option`

# option.ts
Option ~Monad for typescript

`option.ts` can be used with either javascript or typescript.  
This Option wrapper is mostly meant to be used at call sites, where you want to create and transform optional value expressions.
The advantage of only using it there, is that you keep neat, non wrapped JSON structures as your data.


## API

* [Option()](#Option())
* [Option.all()](#Option.all)
* [None](#None)
* [map](#map)
* [flatMap](#flatMap)
* [filter](#filter)
* [orElse](#orElse)
* [match](#match)
* [isDefined](#isDefined)
* [get](#Reading the Option value)
* [getOrElse](#getOrElse)
* [forEach](#forEach)



### Importing the library

Here's everything that can be imported from `option.ts`:  

```ts
import { Option, None, Some } from 'option.ts'
```

### Creating an Option

<a name="Option()"></a>
#### Option(x)

Creates an Option from a value.
If the value is null or undefined, it will create a None, else a Some.

```ts
const some = Option(33) // some === Some(33)
const none = Option(null) // none === None
```

If you already know the value is defined for sure (not nullable) or not, you can create a `Some` or `None` directly:  

```ts
const some = Some(33) // Some(null | undefined) wouldn't compile.
const none = None
```


<a name="Option.all"></a>
#### Option.all(...optionsOrValues)

Creates a new Option holding the tuple of all the passed values if they were all Some or non null/undefined values,  
else returns None

```ts
const some = Option.all(
  Option(10),
  20,
  Option(5)
)
// some === Some([10, 20, 5])

const none = Option.all(
  Option(10),
  None,
  Option(5),
  null
)
// none === None
```
<a name="None"></a>
#### None

The Option constant representing no value.

```ts
import { None } from 'option.ts'
```


### Transforming an Option

<a name="map"></a>
#### map

Maps the value contained in this Some, else returns None.
Depending on the map function return value, a Some could be tranformed into a None, as a Some is guaranteed to never contain a null or undefined value.

```ts
const some = Option(33).map(x => x * 2)
// some === Some(66)
```

<a name="flatMap"></a>
#### flatMap

Maps the value contained in this Some to a new Option, else returns None.

```ts
const some = Option(33).flatMap(_ => Option(44))
// some === Some(44)
```

<a name="filter"></a>
#### filter

If this Option is a Some and the predicate returns true, keep that Some.
In all other cases, return None.

```ts
const some = Option(33).filter(x => x > 32)
// some === Some(33)
```

<a name="orElse"></a>
#### orElse

Returns this Option unless it's a None, in which case the provided alternative is returned.

```ts
const some = Option(null).orElse(() => Option(33))
// some === Some(33)
```

<a name="match"></a>
#### match

Returns the result of calling `Some(value)` if this is a Some, else returns the result of calling `None()``

```ts
const some = Option(10)
const result = some.match({
  Some: x  => (x * 2).toString(),
  None: () => 999
})
// result === '20'
```

### Misc

<a name="Reading the Option value"></a>
#### get

`Some` instances return their value, whereas `None` always return `undefined`.  
Thus, this method never throws.

```ts
const value = Some(33).get()
// value === 33
```

<a name="isDefined"></a>
#### isDefined

Returns whether this Option has a defined value (i.e, it's a Some(value))  
Note: this refines the type of the Option to be a Some so it's guaranteed its value is not null/undefined.

<a name="getOrElse"></a>
#### getOrElse

Returns this Option's value if it's a Some, else return the provided alternative

```ts
const value = Option(undefined).getOrElse(33)

// value === 33
```

<a name="forEach"></a>
#### forEach

Applies the given procedure to the option's value, if it is non empty.

```ts
Option(33).forEach(x => console.log(x))
```
