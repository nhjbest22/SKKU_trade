const request = require("supertest");
const app = require("../app");
const db = require("../db");

describe("Chat API", () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  test("POST /chat/send - should send a message", async () => {
    const message = {
      senderId: "user123",
      receiverId: "user456",
      content: "안녕하세요, 구매 가능할까요?",
    };

    const response = await request(app).post("/chat/send").send(message);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("messageId");
    expect(response.body.senderId).toBe("user123");
    expect(response.body.content).toBe("안녕하세요, 구매 가능할까요?");
  });

  test("GET /chat/messages/:conversationId - should retrieve all messages for a conversation", async () => {
    const conversationId = "conv123";
    const response = await request(app).get(`/chat/messages/${conversationId}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("content");
    expect(response.body[0]).toHaveProperty("senderId");
  });
});
