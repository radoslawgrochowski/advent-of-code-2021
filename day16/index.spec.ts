import { decodePacket, execute, getVersionSum, toBits } from "./index";

describe("day 16", () => {
  describe("toBits", function () {
    test("D2FE28", () => {
      expect(toBits("D2FE28")).toEqual("110100101111111000101000");
    });
    test("38006F45291200", () => {
      expect(toBits("38006F45291200")).toEqual(
        "00111000000000000110111101000101001010010001001000000000"
      );
    });
    test("8A004A801A8002F478", () => {
      expect(toBits("8A004A801A8002F478")).toEqual(
        "100010100000000001001010100000000001101010000000000000101111010001111000"
      );
    });
  });

  describe("decodePacket", () => {
    test("D2FE28", () => {
      expect(decodePacket("110100101111111000101000")).toStrictEqual({
        bits: "110100101111111000101",
        id: 4,
        literal: 2021,
        version: 6,
      });
    });

    test("38006F45291200", () => {
      expect(decodePacket(toBits("38006F45291200"))).toStrictEqual({
        bits: "0011100000000000011011110100010100101001000100100",
        id: 6,
        includes: [
          {
            bits: "11010001010",
            id: 4,
            literal: 10,
            version: 6,
          },
          {
            bits: "0101001000100100",
            id: 4,
            literal: 20,
            version: 2,
          },
        ],
        lengthTypeId: 0,
        version: 1,
      });
    });

    test("EE00D40C823060", () => {
      expect(decodePacket(toBits("EE00D40C823060"))).toStrictEqual({
        bits: "111011100000000011010100000011001000001000110000011",
        id: 3,
        includes: [
          {
            bits: "01010000001",
            id: 4,
            literal: 1,
            version: 2,
          },
          {
            bits: "10010000010",
            id: 4,
            literal: 2,
            version: 4,
          },
          {
            bits: "00110000011",
            id: 4,
            literal: 3,
            version: 1,
          },
        ],
        lengthTypeId: 1,
        version: 7,
      });
    });
  });

  test("8A004A801A8002F478", () => {
    const packet = decodePacket(toBits("8A004A801A8002F478"));
    expect(packet).toStrictEqual({
      bits: "100010100000000001001010100000000001101010000000000000101111010001111",
      id: 2,
      includes: [
        {
          bits: "001010100000000001101010000000000000101111010001111",
          id: 2,
          includes: [
            {
              bits: "101010000000000000101111010001111",
              id: 2,
              includes: [
                {
                  bits: "11010001111",
                  id: 4,
                  literal: 15,
                  version: 6,
                },
              ],
              lengthTypeId: 0,
              version: 5,
            },
          ],
          lengthTypeId: 1,
          version: 1,
        },
      ],
      lengthTypeId: 1,
      version: 4,
    });
    expect(getVersionSum(packet)).toBe(16);
  });

  test("620080001611562C8802118E34", () => {
    const packet = decodePacket(toBits("620080001611562C8802118E34"));
    expect(packet).toStrictEqual({
      bits: "011000100000000010000000000000000001011000010001010101100010110010001000000000100001000110001110001101",
      id: 0,
      includes: [
        {
          bits: "00000000000000000101100001000101010110001011",
          id: 0,
          includes: [
            {
              bits: "00010001010",
              id: 4,
              literal: 10,
              version: 0,
            },
            {
              bits: "10110001011",
              id: 4,
              literal: 11,
              version: 5,
            },
          ],
          lengthTypeId: 0,
          version: 0,
        },
        {
          bits: "0010001000000000100001000110001110001101",
          id: 0,
          includes: [
            {
              bits: "00010001100",
              id: 4,
              literal: 12,
              version: 0,
            },
            {
              bits: "01110001101",
              id: 4,
              literal: 13,
              version: 3,
            },
          ],
          lengthTypeId: 1,
          version: 1,
        },
      ],
      lengthTypeId: 1,
      version: 3,
    });
    expect(getVersionSum(packet)).toBe(12);
  });

  test("C0015000016115A2E0802F182340", () => {
    const packet = decodePacket(toBits("C0015000016115A2E0802F182340"));
    expect(packet).toStrictEqual({
      bits: "1100000000000001010100000000000000000001011000010001010110100010111000001000000000101111000110000010001101",
      id: 0,
      includes: [
        {
          bits: "00000000000000000101100001000101011010001011",
          id: 0,
          includes: [
            {
              bits: "00010001010",
              id: 4,
              literal: 10,
              version: 0,
            },
            {
              bits: "11010001011",
              id: 4,
              literal: 11,
              version: 6,
            },
          ],
          lengthTypeId: 0,
          version: 0,
        },
        {
          bits: "1000001000000000101111000110000010001101",
          id: 0,
          includes: [
            {
              bits: "11110001100",
              id: 4,
              literal: 12,
              version: 7,
            },
            {
              bits: "00010001101",
              id: 4,
              literal: 13,
              version: 0,
            },
          ],
          lengthTypeId: 1,
          version: 4,
        },
      ],
      lengthTypeId: 0,
      version: 6,
    });
    expect(getVersionSum(packet)).toBe(23);
  });

  test("A0016C880162017C3686B18A3D4780", () => {
    const packet = decodePacket(toBits("A0016C880162017C3686B18A3D4780"));
    expect(packet).toStrictEqual({
      bits: "10100000000000010110110010001000000000010110001000000001011111000011011010000110101100011000101000111101010001111",
      id: 0,
      includes: [
        {
          bits: "0010001000000000010110001000000001011111000011011010000110101100011000101000111101010001111",
          id: 0,
          includes: [
            {
              bits: "0110001000000001011111000011011010000110101100011000101000111101010001111",
              id: 0,
              includes: [
                {
                  bits: "11110000110",
                  id: 4,
                  literal: 6,
                  version: 7,
                },
                {
                  bits: "11010000110",
                  id: 4,
                  literal: 6,
                  version: 6,
                },
                {
                  bits: "10110001100",
                  id: 4,
                  literal: 12,
                  version: 5,
                },
                {
                  bits: "01010001111",
                  id: 4,
                  literal: 15,
                  version: 2,
                },
                {
                  bits: "01010001111",
                  id: 4,
                  literal: 15,
                  version: 2,
                },
              ],
              lengthTypeId: 1,
              version: 3,
            },
          ],
          lengthTypeId: 1,
          version: 1,
        },
      ],
      lengthTypeId: 0,
      version: 5,
    });
    expect(getVersionSum(packet)).toBe(31);
  });

  describe("execute", () => {
    test("C200B40A82", () => {
      expect(execute(decodePacket(toBits("C200B40A82")))).toBe(3);
    });
    test("04005AC33890", () => {
      expect(execute(decodePacket(toBits("04005AC33890")))).toBe(54);
    });
    test("880086C3E88112", () => {
      expect(execute(decodePacket(toBits("880086C3E88112")))).toBe(7);
    });
    test("CE00C43D881120", () => {
      expect(execute(decodePacket(toBits("CE00C43D881120")))).toBe(9);
    });
    test("D8005AC2A8F0", () => {
      expect(execute(decodePacket(toBits("D8005AC2A8F0")))).toBe(1);
    });
    test("F600BC2D8F", () => {
      expect(execute(decodePacket(toBits("F600BC2D8F")))).toBe(0);
    });
    test("9C005AC2F8F0", () => {
      expect(execute(decodePacket(toBits("9C005AC2F8F0")))).toBe(0);
    });
    test("9C0141080250320F1802104A08", () => {
      const packet = decodePacket(toBits("9C0141080250320F1802104A08"));
      expect(packet).toStrictEqual({
        bits: "100111000000000101000001000010000000001001010000001100100000111100011000000000100001000001001010000010",
        id: 7,
        includes: [
          {
            bits: "0100001000000000100101000000110010000011",
            id: 0,
            includes: [
              {
                bits: "01010000001",
                id: 4,
                literal: 1,
                version: 2,
              },
              {
                bits: "10010000011",
                id: 4,
                literal: 3,
                version: 4,
              },
            ],
            lengthTypeId: 1,
            version: 2,
          },
          {
            bits: "1100011000000000100001000001001010000010",
            id: 1,
            includes: [
              {
                bits: "00010000010",
                id: 4,
                literal: 2,
                version: 0,
              },
              {
                bits: "01010000010",
                id: 4,
                literal: 2,
                version: 2,
              },
            ],
            lengthTypeId: 1,
            version: 6,
          },
        ],
        lengthTypeId: 0,
        version: 4,
      });

      expect(execute(packet)).toBe(1);
    });
  });
});
