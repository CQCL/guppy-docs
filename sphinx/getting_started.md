---
file_format: mystnb
kernelspec:
  name: python3
---


# Getting Started


## Installation

Guppy is installed as the [guppylang](https://pypi.org/project/guppylang/) Python package.

```shell
pip install guppylang
```

Guppy can be used with Python versions 3.10, 3.11, 3.12 and 3.13. The MacOS, Linux and Windows operating systems are supported.

The source code for Guppy can be found in a public repository on [GitHub](https://github.com/quantinuum/guppylang). If you have a feature request or think you have found a bug, feel free to raise a [GitHub issue](https://github.com/quantinuum/guppylang/issues).

Guppy programs can be executed on the [Selene](https://github.com/quantinuum/selene) emulator. As of the v0.21 release, Selene is now included with `guppylang` and powers the [guppylang.emulator](../sphinx/api/emulator.md) module under the hood.

## Example: Quantum Teleportation

As a first example, let's write a Guppy program to implement the [quantum teleportation](https://en.wikipedia.org/wiki/Quantum_teleportation) scheme.

To implement quantum teleportation, we define a `teleport` function with the @guppy decorator which takes a qubit state to teleport `src` and a target state `tgt`. 

We allocate a temporary ancilla qubit and perform entangling gates between the ancilla before performing some measurements. We can then perform corrections based on these measurement outcomes with Pythonic `if` syntax.

```{code-cell} ipython3
from guppylang import guppy
from guppylang.std.builtins import owned
from guppylang.std.quantum import cx, h, measure, qubit, x, z


@guppy
def teleport(src: qubit @owned, tgt: qubit) -> None:
    """Teleports the state in `src` to `tgt`."""
    # Create ancilla and entangle it with src and tgt
    tmp = qubit()
    h(tmp)
    cx(tmp, tgt)
    cx(src, tmp)

    # Apply classical corrections
    h(src)
    if measure(src):
        z(tgt)
    if measure(tmp):
        x(tgt)
```
As the input `src` qubit is measured and consumed, the teleport function must take [ownership](language_guide/ownership.md) of this qubit. We indicate that the function takes ownership of the `src` qubit using the `@owned` annotation.

For execution, we can write a function to teleport the $|1\rangle$ state to serve as the entry point to our quantum program.

```{code-cell} ipython3
from guppylang.std.builtins import result

@guppy
def teleport_one_state() -> None:
    src = qubit()
    tgt = qubit()

    # Let's teleport the |1> state
    x(src)
    teleport(src, tgt)

    result("teleported", measure(tgt))
```


Finally, we can emulate our teleportation program using the stabilizer simulator. 
Our program is executed for a single shot using the `run` method.

```{code-cell} ipython3

sim_result = teleport_one_state.emulator(n_qubits=3).stabilizer_sim().with_seed(2).run()
list(sim_result.results)
```

To see more examples of Guppy programs, take a look at the [Examples Gallery](examples_index.md).
