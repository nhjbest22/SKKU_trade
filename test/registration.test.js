// itemService.test.js
const createItem = require("./itemService");

describe("createItem", () => {
  test("should successfully create an item with meeting info", () => {
    const item = createItem({
      title: "중고 프로그래밍 책",
      price: 15000,
      category: "전공 도서",
      description: "상태가 좋은 책입니다.",
      image: "image1.jpg",
      meetingInfo: {
        time: "2024-12-01 14:00",
        location: "제1공학관",
      },
    });

    expect(item).toHaveProperty("id");
    expect(item.title).toBe("중고 프로그래밍 책");
    expect(item.price).toBe(15000);
    expect(item.category).toBe("전공 도서");
    expect(item.meetingInfo.time).toBe("2024-12-01 14:00");
    expect(item.meetingInfo.location).toBe("성균관대학교 600주년 기념관");
    expect(item).toHaveProperty("createdAt");
  });

  test("should throw an error when meeting time is missing", () => {
    expect(() =>
      createItem({
        title: "중고 프로그래밍 책",
        price: 15000,
        category: "전공 도서",
        description: "상태가 좋은 책입니다.",
        meetingInfo: {
          time: "",
          location: "성균관대학교 600주년 기념관",
        },
      })
    ).toThrow("만날 시간과 장소는 필수 입력 항목입니다.");
  });

  test("should throw an error when meeting location is missing", () => {
    expect(() =>
      createItem({
        title: "중고 프로그래밍 책",
        price: 15000,
        category: "전공 도서",
        description: "상태가 좋은 책입니다.",
        meetingInfo: {
          time: "2024-12-01 14:00",
          location: "",
        },
      })
    ).toThrow("만날 시간과 장소는 필수 입력 항목입니다.");
  });

  test("should assign default image when image is missing", () => {
    const item = createItem({
      title: "중고 프로그래밍 책",
      price: 15000,
      category: "전공 도서",
      description: "상태가 좋은 책입니다.",
      meetingInfo: {
        time: "2024-12-01 14:00",
        location: "성균관대학교 600주년 기념관",
      },
    });

    expect(item.image).toBe("default-image.jpg");
  });
});
