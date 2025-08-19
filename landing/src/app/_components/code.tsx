
export const guppy_code = `

from guppylang import guppy
from guppylang.std.quantum import qubit, toffoli, s, measure
from guppylang.std.quantum.functional import h

@guppy
def repeat_until_success(q: qubit, attempts: int) -> bool:
    """
    Repeat-until-success circuit for Rz(acos(3/5))
    from Nielsen and Chuang, Fig. 4.17.
    """
  
    for i in range(attempts):
        a, b = h(qubit()), h(qubit())
        toffoli(a, b, q)
        s(q)
        toffoli(a, b, q)
        if not (measure(h(a)) | measure(h(b))):
            result("rus_attempts", i)
            return True
    return False

# type check the program
repeat_until_success.check()
`
