function sum(a, b) {
    return a + b;
}

test("Testing to see if Jest works", () => {
    expect(sum(1, 2)).toBe(3);
});
