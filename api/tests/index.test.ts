import { app, serverInstance } from "../src/";
import { Database } from "../src/Database";
import { User } from "../src/Database/user.schema";
import { extractCookies } from "./util/extractCookies";
import request from "supertest";
beforeAll(async () => {
  await Database.Init();
  await User.deleteMany();
});

const mockUser = {
  handle: "andrei",
  email: "andrei@gmail.com",
  password: "apples",
};

describe("Authentication", () => {
  describe("Register:", () => {
    const path = "/api/auth/register";
    describe("Success:", () => {
      let res: any;
      it("Should respond with 200 on success", async () => {
        res = await request(app).post(path).send(mockUser);
        expect(res.statusCode).toBe(200);
      });

      it("Should pass 'auth' cookie with jwt token", () => {
        expect(extractCookies(res.headers).auth).toBeTruthy();
      });
      it("Should respond with user's handle", () => {
        expect(res.body.data.handle).toBe(mockUser.handle);
      });

      it("Should save user to the database", async () => {
        const count = await User.countDocuments({ handle: mockUser.handle });
        expect(count).toBe(1);
      });
    });
    describe("Missing required field:", () => {
      let res: any;
      const { handle, email, password } = mockUser;
      it("Should respond with 400 with no handle in the body", async () => {
        res = await request(app).post(path).send({ email, password });
        expect(res.statusCode).toBe(400);
      });
      it("Should respond with 400 with no email in the body", async () => {
        res = await request(app).post(path).send({ handle, password });
        expect(res.statusCode).toBe(400);
      });
      it("Should respond with 400 with no password in the body", async () => {
        res = await request(app).post(path).send({ email, handle });
        expect(res.statusCode).toBe(400);
      });
      it("Should NOT set 'auth' cookie", () => {
        expect(extractCookies(res.headers).auth).toBeUndefined();
      });
    });
    describe("If user already exists", () => {
      let res: any;
      it("Should respond with 400", async () => {
        res = await request(app).post(path).send(mockUser);
        expect(res.statusCode).toBe(400);
      });
      it("Should NOT set 'auth' cookie", () => {
        expect(extractCookies(res.headers).auth).toBeUndefined();
      });
      it("Should respond with 'User already exists'", () => {
        expect(res.body.message).toBe("User already exists");
      });
      it("Should NOT save user to the database", async () => {
        const count = await User.countDocuments({ email: mockUser.email });
        expect(count).toBe(1);
      });
    });
  });
  describe("Login:", () => {
    const path = "/api/auth/login";
    describe("Successful login:", () => {
      let res: any;
      it("Should respond with 200", async () => {
        res = await request(app).post(path).send(mockUser);
        expect(res.statusCode).toBe(200);
      });
      it("Should respond with user's handle", () => {
        expect(res.body.data.handle).toBe(mockUser.handle);
      });
      it("Should set 'auth' cookie", () => {
        expect(extractCookies(res.headers).auth).toBeTruthy();
      });
    });
    describe("If email is incorrect", () => {
      let res: any;
      const { password } = mockUser;
      it("Should respond with 400", async () => {
        res = await request(app)
          .post(path)
          .send({ password, email: "incorrect" });
        expect(res.statusCode).toBe(400);
      });
      it("Should NOT set 'auth' cookie", () => {
        expect(extractCookies(res.headers).auth).toBeUndefined();
      });
      it("Should respond with 'Email or password is incorrect'", () => {
        expect(res.body.message).toBe("Email or password is incorrect");
      });
    });
    describe("If password is incorrect", () => {
      let res: any;
      const { email } = mockUser;
      it("Should respond with 400", async () => {
        res = await request(app)
          .post(path)
          .send({ email, password: "incorrect" });
        expect(res.statusCode).toBe(400);
      });
      it("Should NOT set 'auth' cookie", () => {
        expect(extractCookies(res.headers).auth).toBeUndefined();
      });
      it("Should respond with 'Email or password is incorrect'", () => {
        expect(res.body.message).toBe("Email or password is incorrect");
      });
    });
    describe("Missing required field:", () => {
      let res: any;
      const { handle, email, password } = mockUser;
      it("Should respond with 400 with no email in the body", async () => {
        res = await request(app).post(path).send({ handle, password });
        expect(res.statusCode).toBe(400);
      });
      it("Should respond with 400 with no password in the body", async () => {
        res = await request(app).post(path).send({ email, handle });
        expect(res.statusCode).toBe(400);
      });
      it("Should NOT set 'auth' cookie", () => {
        expect(extractCookies(res.headers).auth).toBeUndefined();
      });
    });
  });
  describe("Logout:", () => {
    const path = "/api/auth/logout";

    it("Should remove cookies from the response header", async () => {
      const res = await request(app).post(path);
      expect(extractCookies(res.headers).auth).toBeFalsy();
    });
  });
});
afterAll(async () => {
  await User.deleteMany();
  Database.Destroy();
  serverInstance.close();
});
