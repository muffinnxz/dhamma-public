module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(test.ts)?$": "ts-jest"
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1" // Maps @/* imports to src/*
  }
};
