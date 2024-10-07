module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  verbose: true,

  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }], // ts-jest 설정을 여기에 적용
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],

  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/src/app/_asset/__mocks__/styleMock.js",
    // 모든 CSS, SASS, SCSS 파일을 styleMock.js로 매핑하여 실제 파일을 불러오지 않도록 처리

    // CSS 모듈을 빈 객체로 처리 (모듈화된 CSS 처리)
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

    // "@/..." 별칭을 프로젝트의 src 디렉토리로 매핑
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
