const authExamples = {
  valid: {
    summary: "Valid Request",
    value: {
      email: "john.doe@example.com",
      password: "password123",
    },
  },
};

const tokenExample = { accessToken: "jwt-token-example" };

const userExample = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
};

const createUserExample = {
  valid: {
    summary: "Valid Request",
    value: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    },
  },
};

export const AUTH_EXAMPLES = {
  loginBody: authExamples,
  tokenResponse: tokenExample,
  registerUserBody: createUserExample,
  createUserResponse: userExample,
};
