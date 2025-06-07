import { expect } from "chai";
import { ethers } from "hardhat";
import type { Contract } from "ethers";
import { keccak256, toUtf8Bytes } from "ethers";

describe("DiplomaRegistry", function () {
  let diplomaRegistry: Contract;
  let owner: any;
  let addr: any;

  beforeEach(async function () {
    [owner, addr] = await ethers.getSigners();

    const DiplomaRegistry = await ethers.getContractFactory("DiplomaRegistry");
    diplomaRegistry = await DiplomaRegistry.deploy();
    await diplomaRegistry.waitForDeployment();
  });

  it("Register and verify", async function () {
    const diplomaHash = keccak256(toUtf8Bytes("test-diploma"));
    await expect(diplomaRegistry.connect(owner).registerDiploma(diplomaHash, "Nikita"))
      .to.emit(diplomaRegistry, "DiplomaRegistered")
      .withArgs(diplomaHash, owner.address);

    expect(await diplomaRegistry.verifyDiploma(diplomaHash)).to.equal(true);
  });

  it("Duplicate register", async function () {
    const diplomaHash = keccak256(toUtf8Bytes("test-diploma"));

    await diplomaRegistry.connect(owner).registerDiploma(diplomaHash, "Nikita");

    await expect(diplomaRegistry.connect(addr).registerDiploma(diplomaHash, "Ivan")).to.be.revertedWith(
      "Diploma already registered",
    );
  });

  it("Non-existent verify", async function () {
    const fakeHash = keccak256(toUtf8Bytes("fake-diploma"));
    expect(await diplomaRegistry.verifyDiploma(fakeHash)).to.equal(false);
  });
});
