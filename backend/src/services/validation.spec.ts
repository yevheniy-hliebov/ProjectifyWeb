import { validateEmail, validatePassword, validateUsername } from "./users.service";

describe('Username validation', () => {
  it("Valid usernames", () => {
    expect(validateUsername("a-b")).toBeTruthy();
    expect(validateUsername("ab-cd")).toBeTruthy();
    expect(validateUsername("12-34")).toBeTruthy();
    expect(validateUsername("abcd-e")).toBeTruthy();
    expect(validateUsername("123-45")).toBeTruthy();
    expect(validateUsername("abcdefghijklmnopqrstuvwxy-z")).toBeTruthy();
  });

  it("Invalid usernames", () => {
    expect(validateUsername("a")).toBeFalsy();
    expect(validateUsername("abc!")).toBeFalsy();
    expect(validateUsername("abc}")).toBeFalsy();
    expect(validateUsername("-")).toBeFalsy();
    expect(validateUsername("--")).toBeFalsy();
    expect(validateUsername("---")).toBeFalsy();
    expect(validateUsername("-adf")).toBeFalsy();
    expect(validateUsername("fdfa-")).toBeFalsy();
    expect(validateUsername("a--b")).toBeFalsy();
    expect(validateUsername("-a-b")).toBeFalsy();
  });
});

describe('Email validation', () => {
  it("Valid emails", () => {
    expect(validateEmail("abc-d@mail.com")).toBeTruthy();
    expect(validateEmail("abc.def@mail.com")).toBeTruthy();
    expect(validateEmail("abc@mail.com")).toBeTruthy();
    expect(validateEmail("abc_def@mail.com")).toBeTruthy();
    expect(validateEmail("abc.def@mail.cc")).toBeTruthy();
    expect(validateEmail("abc.def@mail-archive.org")).toBeTruthy();
    expect(validateEmail("abc.def@mail.org")).toBeTruthy();
    expect(validateEmail("abc.def@mail.com")).toBeTruthy();
  });

  it("Invalid emails", () => {
    expect(validateEmail("abc-@mail.com")).toBeFalsy();
    expect(validateEmail("abc..def@mail.com")).toBeFalsy();
    expect(validateEmail(".abc@mail.com")).toBeFalsy();
    expect(validateEmail("abc#def@mail.com")).toBeFalsy();
    expect(validateEmail("@mail.cc")).toBeFalsy();
    expect(validateEmail("abc.def@mail.c")).toBeFalsy();
    expect(validateEmail("abc.def@mail")).toBeFalsy();
    expect(validateEmail("abc.def@mail..com")).toBeFalsy();
    expect(validateEmail("mail.com")).toBeFalsy();
  });
});

describe('Password validation', () => {
  it("Valid passwords", () => {
    expect(validatePassword("P@ssw0rd")).toBeTruthy();
    expect(validatePassword("Abcdefg1!")).toBeTruthy();
    expect(validatePassword("Password123$")).toBeTruthy();
    expect(validatePassword("SecureP@ss1")).toBeTruthy();
    expect(validatePassword("9Symbols&Lett")).toBeTruthy();
    expect(validatePassword("Qwerty12@")).toBeTruthy();
  });

  it("Invalid passwords", () => {
    expect(validatePassword("pas")).toBeFalsy();
    expect(validatePassword("ЛегкийПароль")).toBeFalsy();
    expect(validatePassword("password1234")).toBeFalsy();
    expect(validatePassword("!@#$%^&*()")).toBeFalsy();
    expect(validatePassword("1234567890")).toBeFalsy();
    expect(validatePassword("qwerty")).toBeFalsy();
    expect(validatePassword("QWERTY")).toBeFalsy();
    expect(validatePassword("123QWERTY1234")).toBeFalsy();
    expect(validatePassword("abcdefg")).toBeFalsy();
    expect(validatePassword("12345678")).toBeFalsy();
    expect(validatePassword("Abcdefg1")).toBeFalsy();
    expect(validatePassword("!@#$%^&*()")).toBeFalsy();
  });
});














