const main = async () => {
  const LoginPage = await hre.ethers.getContractFactory("LoginPage");
  const loginPage = await LoginPage.deploy();

  await loginPage.deployed();

  console.log("Transactions address: ", loginPage.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
