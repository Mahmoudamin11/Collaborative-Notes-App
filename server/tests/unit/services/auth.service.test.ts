import AuthService from "@services/auth.service";
import { describe, it, expect, vi } from "vitest";

const findByEmailMock = vi.fn();
const mockUserService = {
  findByEmail: findByEmailMock,
  findById: vi.fn(),
  create: vi.fn(),
} as any;

describe("AuthService - login", () => {
  const comparePasswordMock = vi.fn();
  const mockUser = {
    id: "1",
    email: "test@test.com",
    comparePassword: comparePasswordMock,
    toJSON: () => ({ id: "1", email: "test@test.com" }),
  };

  it("should login successfully", async () => {
    comparePasswordMock.mockResolvedValue(true);
    findByEmailMock.mockResolvedValue(mockUser);

    const authService = new AuthService(mockUserService);

    const result = await authService.login({
      email: "test@test.com",
      password: "123456",
    });

    expect(result.user.email).toBe("test@test.com");
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(typeof result.accessToken).toBe("string");
    expect(typeof result.refreshToken).toBe("string");
    expect(result.accessToken.length).toBeGreaterThan(10);
    expect(result.refreshToken.length).toBeGreaterThan(10);
  });

  it("should reject invalid Email", async () => {
    findByEmailMock.mockResolvedValue(null);

    const authService = new AuthService(mockUserService);

    await expect(
      authService.login({
        email: "test@test.com",
        password: "123456",
      }),
    ).rejects.toThrow("Invalid credentials");
  });

  it("should reject wrong password", async () => {
    findByEmailMock.mockResolvedValue(mockUser);

    comparePasswordMock.mockResolvedValue(false);

    const authService = new AuthService(mockUserService);

    await expect(
      authService.login({
        email: "test@test.com",
        password: "123456",
      }),
    ).rejects.toThrow("Invalid credentials");
  });
});

describe("AuthService - register", () => {
  const mockUser = {
    id: "1",
    email: "test@test.com",
    name: "Test User",
    toJSON: () => ({ id: "1", email: "test@test.com", name: "Test User" }),
  };
  it("should register successfully", async () => {
    findByEmailMock.mockResolvedValue(null);
    const createdUser = {
      email: "test@test.com",
      name: "Test User",
    };

    const mockUserService = {
      findByEmail: findByEmailMock,
      create: vi.fn().mockResolvedValue(createdUser),
      findById: vi.fn(),
    } as any;
    const authService = new AuthService(mockUserService);

    const result = await authService.register({
      email: "test@test.com",
      name: "Test User",
      password: "123456",
    });

    expect(result.email).toBe("test@test.com");
    expect(result.name).toBe("Test User");
  });
  it("should reject existing email", async () => {
    findByEmailMock.mockResolvedValue(mockUser);

    const authService = new AuthService(mockUserService);

    await expect(
      authService.register({
        email: "test@test.com",
        name: "Test User",
        password: "123456",
      }),
    ).rejects.toThrow("Email already registered");
  });
});
