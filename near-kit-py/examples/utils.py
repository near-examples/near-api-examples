from near import Amount, Gas

# Amount is an int subclass in yoctoNEAR: arithmetic is exact and it prints as NEAR
one_near = Amount("1 NEAR")
print(repr(one_near))  # Amount('1 NEAR')
print(int(one_near))  # 1000000000000000000000000 yoctoNEAR

# Parse from NEAR or from yoctoNEAR
print(Amount("0.1 NEAR"))
print(Amount("1000000000000000000000000 yocto"))

# Build from numbers
print(Amount.near(2.5))
print(Amount.yocto(1))

# Convert back to NEAR as an exact Decimal
print(one_near.as_near)

# Gas works the same way
gas = Gas("30 Tgas")
print(repr(gas), int(gas), gas.as_tgas)
