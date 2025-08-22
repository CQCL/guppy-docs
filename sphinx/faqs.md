---
file_format: mystnb
kernelspec:
  name: python3
---

# FAQs

## When do I use Python and when do I use Guppy?

Use Python if possible, in general it is more expressive than Guppy. Use Guppy for
quantum operations and for classical things when something depends on the results of a
measurement. The exception to this rule of thumb is when doing everything in Python
ahead of time would make your Guppy program really big. It is often more
compact to use guppy loops and functions to avoid repeating things in programs. 

The `comptime` functionality lets you mix Guppy and Python to make use of compile time
evaluation, see more in the [language guide section](language_guide/comptime.md)

## How do I use this pytket OpType or Box?

Guppy has a standard (small) quantum set defined in the guppy standard library
module [quantum](api/generated/guppylang.std.quantum.rst).
The quantinuum hardware primitive gates are also available in the [qsystem module](api/generated/guppylang.std.quantum.rst).

To use a pytket op or Box synthesis outside this set you can define a circuit, get
pytket to synthesise in to a universal gate set which is a subset of the gates known to
Guppy, then load it in. See more in the [migration guide](migration_guide.md).


## How do angles work?
Some functions in Guppy take angles as arguments, for example an `rz`
function for rotating a qubit about Z. `angle` is a std library type imported
from [guppylang.std.angles](api/generated/guppylang.std.angles.rst). It can be constructed from a `float` corresponding to half
turns or by arithmetic on another angle like `pi`:

```{code-cell} ipython3
from guppylang import guppy
from guppylang.std.angles import angle, pi
from guppylang.std.quantum import qubit, rz

@guppy
def rotate(q: qubit) -> None:
    # an integer multiple of `angle` is also an angle
    rz(q, 2*pi)
    # equivalent explicit construction from float in half-turns
    pi_2 = angle(2.0)
    rz(q, pi_2)
```

## Why am I getting "unsupported" errors?

This Guppy function doesn't currently have compilation to HUGR. Please find/raise an issue or find a different way of writing your program.

## Why am I getting "no lowering found" errors?

Though Guppy can compile your operation to HUGR, the lowering to LLVM executable code for the Selene simulator doesn't yet work. Please find a workaround or raise an issue on the [HUGR repository](https://github.com/cqcl/hugr/).
