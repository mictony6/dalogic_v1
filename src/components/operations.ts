// Function to cut off extra bits and keep only a specified number of bits
function truncateBits(number: number, numBits: number) {
  // Create a bitmask with the desired number of bits
  const bitmask = (1 << numBits) - 1;

  // Perform bitwise AND operation to retain only the specified number of bits
  return number & bitmask;
}

export function AND(a: number, b: number) {
  return a & b;
}

export function OR(a: number, b: number) {
  return a | b;
}

export function XOR(a: number, b: number) {
  return a ^ b;
}

function NOT(a: number) {
  return truncateBits(~a, 2);
}

export function NAND(a: number, b: number) {
  return NOT(AND(a, b));
}




export const pattern = [
  [
    AND,
    null,
    XOR,
    null,
    NAND,
    null,
    OR,
    null,
  ],
  [
    null,
    XOR,
    null,
    AND,
    null,
    OR,
    null,
    NAND,
  ],
  [
    NAND,
    null,
    OR,
    null,
    AND,
    null,
    XOR,
    null,
  ],
  [
    null,
    OR,
    null,
    NAND,
    null,
    XOR,
    null,
    AND,
  ],
  [
    AND,
    null,
    XOR,
    null,
    NAND,
    null,
    OR,
    null,
  ],
  [
    null,
    XOR,
    null,
    AND,
    null,
    OR,
    null,
    NAND,
  ],
  [
    NAND,
    null,
    OR,
    null,
    AND,
    null,
    XOR,
    null,
  ],
  [
    null,
    OR,
    null,
    NAND,
    null,
    XOR,
    null,
    AND,
  ],
];