# March 2025 Release Notes

The new software stack is ready for internal consumption to help us develop internal
projects and soft launch experiments. You can treat it as "feature complete" for what
we've received as soft launch requirements. What we are not is "polished". This is a lot
of new software - a lot of things to document and explain and a lot of things that can
go wrong. We've started making headway on documentation but we'll need your help to find
and squash bugs, so we can really be polished in time for commercial launch.

A quick summary of what has been delivered already, these should be covered by the
existing [example notebooks](../notebooks/):

1. Example notebooks of key features
2. Emulation support for all key features via Selene 
    1. Statevector, stablizer and MPS
	based simulation 
    2. Device-accurate calculation of ion transport (optional) 
    3. Noise model framework with depolarising error model
3. Programming with “textbook” set of quantum functions
4. Programming with Quantinuum platform native gates
5. Function definitions and calls
6. Real-time classical logic and arithmetic including over angles
7. Full structured control flow including while loops and early return
8. Linear qubit types with checking and error messages
9. Statically sized arrays enabling qubit-scalable programs
10. Static immutable arrays for fast lookup tables and parameterisation
11. Tagged integer, boolean, float output types with dynamic outputs/results
12. Load pytket circuits as guppy functions
13. Load simple types from outer Python scope
14. Constant structs (Frozen Dataclass/NamedTuple style) and methods
15. Meta-programming using compile time python evaluation
16. Exit - stop running this shot (optional message) and continue


## Pitfalls

Here we outline some key things that we expect to resolve by the time we get to soft
launch but may cause pitfalls now. If you are affected by these, keep an eye on updates
and let us know about your specific problems, we may able to suggest workarounds or
shorter-term fixes.

### Emulator name
The helios emulation package is now known as "selene". It was previously known as "hsim".

To migrate from hsim:
- replace `from hsim import ...` to `from selene_sim import ...`.
- replace usage of `build_hsim` to simply `build`.
- if you are using `filename` as a named parameter to `build`, change it to `name`

### Arrays
Statically sized arrays are a key guppy feature and allow us to offer scalable, user
friendly programs which are also very fast at the low level (faster the classical
program, the less the memory error). 

They are used for both quantum and classical values - arrays of qubits are the closest
equivalent of "registers" from the circuit world. In the classical case there are
actually two kinds of array:

1. When you load a list in from python like `comptime(my_python_list)` that's loaded in
   as an immutable Guppy array. You can index it to get at values but can't change them
   in any way. This lets us have very high performance on these arrays for use cases
   like parametrising circuits over shots or lookup table decoding.
2. Normal Guppy `array` allows setting new values (`arr[i] = 4`). To make these more
   performant we require explicit `.copy()` to minimise copying of values (only possible
   on classical arrays). 

Qubits can only be used with the second kind of array.

> [!WARNING]
> The second kind of array **is still not performant enough**.  We're working
on it but you may find usage of arrays of size ~100 or more cause slow compile and/or
execution times. We have a plan to address this and it will be sorted by soft launch.

> [!Note]
> Reporting results of whole arrays of integer, float, bool types is expected soon.

### WASM
Using WASM for a linked classical runtime for use with algorithmic decoding is planned
for soft launch. This will look just like calling other classical functions in Guppy. If
you expect to work on algorithmic decoder experiments please reach out as early as you
can.

### Documentation
We realise we're asking current users to learn a lot of new things with initially
inadequate documentation. We are working on a comprehensive language guide for Guppy and
a usage guide for the emulator and Helios. These will be delivered incrementally up to
soft launch. Please reach out to developers (the `guppy-users` slack channel) or OpEx
for specific support.

### Device Error Model
The emulator supports a flexible error model framework. Initially we will provide simple
depolarising models. Next up (coming soon) will be a model based on H2 with the ability
to fiddle the parameters. Once we have the results from initial benchmarking of Helios,
the parameters and model will be updated to match, and then kept up to date.

### Quantum Optimisation
Quantum circuit optimisation will proceed in three stages:
1. As of March 2025 TKET2 is used only to rebase standard quantum operations to the
   device gate set with **no optimisation**.
2. By soft launch we will add **optional** TKET1 optimisation over unitary sub-regions
   of guppy programs.
3. In parallel we're working on developing novel quantum-classical optimisation over
   whole guppy programs.

### Depth-1 performance/lazy measurement
The helios runtime has two different timelines:
1. The user program timeline on the control system. All the classical things happen as
   they execute, but the quantum operations are streamed out to the runtime for
   calculation. 
2. A measurement triggers the runtime to compute transport for all the gates on the
measured qubit up to that point, then perform the gates, transport and measurement. This
allows gate zone parallelism (based on data dependency of qubits) and dynamic transport.
This means that a "zz_phase" call in a guppy program should be read as a request to do
that gate, rather than one that executes at that point in the program. We are aware that
depth-1 performance (time to complete a parallel set of gating operations and
transports) can be improved. One of the ways we are going to do this is wait until a
measurement result is *needed* by some further computation to flush the gates, rather
than just when the measurement was requested in the program. We call this "lazy
measurement".
### Non-Helios support
Initially Guppy programs will only run on Helios or the emulator. Full Guppy programs
will continue to only run on Helios or future systems. We will be able to offer support
for a limited subset of programs that can run on H2, and an even more limited set that
can run on non-Quantinuum systems. Execution on H2 will be via compilation to QIR, work
on which is ongoing. When we can't compile to a system, the compiler will give useful
hints as to why.

### Nexus
Nexus will be the primary way of accessing Helios, and the only way to submit guppy
programs. The emulator is and will remain available locally. As of March 2025 submission
of programs and retrieval of results from the deadhead endpoint works on Nexus. We will
add the emulator as an execution target on Nexus, which will allow scaling and low queue
times, with the full device error model.
