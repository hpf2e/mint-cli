export default (code: number) => {
  if (code > 0) {
    throw new Error(`Process exited with code ${code}`);
  }
};
