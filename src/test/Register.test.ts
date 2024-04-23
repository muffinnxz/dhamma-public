import { passwordSafety, validEmail } from "../lib/validation";

describe("passwordSafety", () => {
  it("Case 1: Password is less than 8 characters", () => {
    expect(passwordSafety("ppp", "ppp")).toStrictEqual("Password should be more than or equal to 8 characters");
  });

  it("Case 2: Password doesn't contain any number", () => {
    expect(passwordSafety("Password", "Password")).toStrictEqual("Password should contain at least 1 number");
  });

  it("Case 3: Password doesn't contain any uppercase character", () => {
    expect(passwordSafety("password123", "password123")).toStrictEqual(
      "Password should contain at least 1 uppercase character"
    );
  });

  it("Case 4: Password doesn't contain any lowercase character", () => {
    expect(passwordSafety("PASSWORD123", "PASSWORD123")).toStrictEqual(
      "Password should contain at least 1 lowercase character"
    );
  });

  it("Case 5: Password and confirm password are not the same", () => {
    expect(passwordSafety("Password1234", "Password123")).toStrictEqual(
      "Password and confirm password should be the same"
    );
  });

  it("Case 6: Password meets all criteria", () => {
    expect(passwordSafety("Password123", "Password123")).toStrictEqual("Password is safe");
  });
});

describe("validEmail", () => {
  it("Case 1: Email is invalid", () => {
    expect(validEmail("email")).toStrictEqual("Invalid email format");
  });

  it("Case 2: Email is invalid", () => {
    expect(validEmail("email@gmail")).toStrictEqual("Invalid email format");
  });

  it("Case 3: Email is invalid", () => {
    expect(validEmail("email.com")).toStrictEqual("Invalid email format");
  });

  it("Case 4: Email is valid", () => {
    expect(validEmail("woraphat@gmail.com")).toStrictEqual("Email is valid");
  });
});
