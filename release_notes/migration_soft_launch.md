

# Softlaunch migration guide (August 2025)

This guide outlines how to upgrade from guppylang 0.19 to guppylang 0.21 - which
corresponds to the private-preview version of the stack. For completeness the relevant
soft launch packages as listed in a `pyproject.toml` are:
```toml
dependencies = [
    "guppylang~=0.21",
    "selene-sim~=0.2",
    "tket~=0.12",
    "eldarion~=-0.5"
]
```
However, selene-sim is now pulled in by guppylang and eldarion is deployed to nexus so
locally you should only have to install guppylang (and `tket` if you are loading pytket
circuits in.)
> [!TIP]  
> Up to soft launch date some of these packages may only have "release candidates"
> released, meaning the version will end with ".rc". `pip` or `uv` may refuse to install
> such pre-release versions unless explicitly requested.


Nexus will update to use eldarion 0.5 for compilation on August 6th 2025. At which points programs written in the guppylang 0.19 style will no longer work, follow this guide to fix them up.


## Nexus submissions

`guppy.compile_module` and `guppy.compile` no longer work, and explicit "modules" have been removed as a concept in guppy. Now you simply have your @guppy decorated functions and methods on them to do what you need. This also means your execution entrypoint need no longer be called `main`, any function that doesn't take any arguments can be your entry-point. 

So say you write a function:

```python
@guppy
def teleport() -> None:
    src, tgt = qubit(), qubit()

    tmp = qubit()
    h(tmp)

    cx(tmp, tgt)
    cx(src, tmp)

    h(src)
    if measure(src):
        z(tgt)
    if measure(tmp):
        x(tgt)

    result("tgt", measure(tgt))
```

Some things you can do with it:
```python
# type check
teleport.check()
# compile to hugr
hugr = teleport.compile()
```


So if **before** you submitted like so:

```python
hugr = guppy.compile_module()

# Upload the compiled HUGR program to Nexus database, get a reference to it
conditional_hugr_program = qnx.hugr.upload(
    hugr_package=hugr,
    name="teleportation",
)
```

**Now** you do:

```python
# Upload the compiled HUGR program to Nexus database, get a reference to it
conditional_hugr_program = qnx.hugr.upload(
    hugr_package=teleport.compile(),
    name="teleportation",
)
```

### No more `PackagePointer`

`guppy.compile_module()` used to return a `PackagePointer` type, which you had to do `.package` on to get the underlying HUGR `Package`, or maybe you ran `to_executable_package()` first. All of this is now unnecessary, `foo.compile()` directly returns the HUGR `Package` for `foo` and can be passed directly to `qnx.hugr.upload`.

## Local selene

The core of the selene emulator is now open source, meaning guppy can come with emulation built-in. This means no more need to pass things between guppy/hugr/selene yourself. We expand on the `foo.check(), foo.compile()` style interface for this:

**Before**
```python
# assumed there is a `main` function
runner = build(guppy.compile_module())
res = QsysResult(
	runner.run_shots(
		Stim(random_seed=42),
		n_qubits=8,
		n_shots=1000,
		error_model=error_model,
	)
)
```

**After**
```python
res = (
	teleport.emulator(n_qubits=8) # compile program in to an emulation instance
	.stabilizer_sim() # set simulation mode to stabilizer
	.with_seed(42) # configure seed, shots, error model
	.with_shots(1000)
	.with_error_model(error_model)
	.run() # run emulation and return results
    )
```
For more examples see the guppylang [example notebooks](https://github.com/CQCL/guppylang/tree/main/examples)

## tket2 -> tket

The `tket2` package and all sub-packages have been renamed to `tket`. Be careful with
any existing `tket2` dependencies you have in your projects.

## Guppy on H1/H2
> [!WARNING]  
> This workflow is very experimental

It is possible to run _some_ guppy programs on H1 and H2. To submit the programs to the hardware they first need to converted to QIR and submitted 
to the device with pytket-quantinuum. Details about the conversion and submission can be found in an [example notebook]( 
https://github.com/CQCL/hugr-qir/blob/main/examples/submit-guppy-h1-h2-via-qir.ipynb). hugr-qir can be installed from PyPi.
This conversion has some limitations that we are working on loosening:
- Loops can only be converted if the number of iterations is known at compile time.
- Programs containing qubit arrays can't be converted.
  
hugr-qir>=0.0.8 will be compatible with guppy 0.21.
