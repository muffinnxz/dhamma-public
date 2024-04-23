import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config({ path: ".env.local" });
import { createMocks } from "node-mocks-http";
import handler from "./create";
import { NextApiRequest, NextApiResponse } from "next";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    id: string;
    name: string;
    email: string;
    picture: string;
    userType: string;
    placeType?: string;
    placeLocation?: string;
    province?: string;
    postalCode?: string;
  };
}

describe("/api/user/create", () => {
  test("successfully creates a user", async () => {
    const randomId = uuidv4();

    const { req, res } = createMocks<ExtendedNextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        id: randomId,
        name: "John Doe",
        email: "john@example.com",
        picture: "base64image",
        userType: "user",
        placeType: "type",
        placeLocation: "location",
        province: "province",
        postalCode: "12345"
      }
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
  });

  test("returns 400 for invalid email format", async () => {
    const randomId = uuidv4();
    const { req, res } = createMocks<ExtendedNextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        id: randomId,
        name: "John Doe",
        email: "johnexample.com",
        picture: "base64image",
        userType: "user",
        placeType: "type",
        placeLocation: "location",
        province: "province",
        postalCode: "12345"
      }
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(400);
  });

  test("returns 409 for existing user", async () => {
    const { req, res } = createMocks<ExtendedNextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        id: "LujYFLrzNTdQrWxxDVlGV1UTOwo1",
        name: "John Doe",
        email: "john@example.com",
        picture: "base64image",
        userType: "user",
        placeType: "type",
        placeLocation: "location",
        province: "province",
        postalCode: "12345"
      }
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(409);
  });
  test("returns 500 for internal server error", async () => {
    const { req, res } = createMocks<ExtendedNextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        id: null,
        name: "John Doe",
        email: "john@example.com",
        picture: "base64image",
        userType: "user",
        placeType: "type",
        placeLocation: "location",
        province: "province",
        postalCode: "12345"
      }
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
  });

  test("returns 500 for invalid name type", async () => {
    const { req, res } = createMocks<ExtendedNextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        id: "LujYFLrzNTdQrWxxDVlGV1UTOwo1",
        name: 543434,
        email: "john@example.com",
        picture: "base64image",
        userType: "user",
        placeType: "type",
        placeLocation: "location",
        province: "province",
        postalCode: "12345"
      }
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(400);
  });
});
