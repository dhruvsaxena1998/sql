module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  verbose: true,
  collectCoverage: true
}
