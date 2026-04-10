exports.register = async (payload) => {
  const { name, email } = payload || {};

  return {
    message: "User registered successfully (mock)",
    user: {
      id: 1,
      name: name || "Mock User",
      email: email || "mock@example.com"
    }
  };
};

exports.login = async (payload) => {
  const { email } = payload || {};

  return {
    message: "Login successful (mock)",
    token: "mock-jwt-token",
    user: {
      id: 1,
      email: email || "mock@example.com"
    }
  };
};
