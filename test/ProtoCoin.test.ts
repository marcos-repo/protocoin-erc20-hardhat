import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("ProtoCoin Tests", function () {

  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const ProtoCoin = await hre.ethers.getContractFactory("ProtoCoin");
    const protocoin = await ProtoCoin.deploy();

    return { protocoin, owner, otherAccount };
  }

  it("Should have correct name", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const name = await protocoin.name();
      expect(name).eq("ProtoCoin");
    });

  it("Should have correct symbol", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const symbol = await protocoin.symbol();
      expect(symbol).eq("PTC");
    });

  it("Should have correct decimals", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const decimals = await protocoin.decimals();
      expect(decimals).eq(18);
    });

  it("Should have total supply", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const totalSupply = await protocoin.totalSupply();
      const decimals = await protocoin.decimals();
      expect(totalSupply).eq(1_000_000n * 10n ** decimals);
    });

  it("Should get balance", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const balanceOf = await protocoin.balanceOf(owner);
      const decimals = await protocoin.decimals();
      expect(balanceOf).eq(1_000_000n * 10n ** decimals);
    });

  it("Should transfer", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);
      const value = 1_000_000n;

      const totalSupply = await protocoin.totalSupply();
      await protocoin.transfer(otherAccount.address, value);

      const balanceOfOwner = await protocoin.balanceOf(owner.address);
      const balanceOfotherAccount = await protocoin.balanceOf(otherAccount.address);
      
      expect(balanceOfOwner).eq(totalSupply - value);
      expect(balanceOfotherAccount).eq(value);
    });
  
  it("Should NOT transfer", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      const instance = protocoin.connect(otherAccount);

      await expect(instance.transfer(owner.address, 1n))
            .to
            .be
            .revertedWith("Saldo insuficiente.");
    });


    it("Should approve", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);

      await protocoin.aprove(otherAccount.address, 1n);

      const value = await protocoin.allowance(owner.address, otherAccount.address);
      expect(value).eq(1n);
    });

    it("Should transfer from", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);
      const value = 1_000_000n;

      await protocoin.aprove(otherAccount.address, 1_000_000);

      const instance = protocoin.connect(otherAccount);
      await instance.transferFrom(owner.address, otherAccount.address, value);

      const allowance = await protocoin.allowance(owner, otherAccount.address);
      expect(allowance).eq(0);

      const balanceOtherAccount = await protocoin.balanceOf(otherAccount.address);
      expect(balanceOtherAccount).eq(value);
    });

    it("Should NOT transfer from", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);
      const value = 1_000_000n;
      
      const instance = protocoin.connect(otherAccount);

      await expect(instance.transferFrom(owner.address, otherAccount.address, value))
            .to
            .be
            .revertedWith("Saldo permitido insuficiente.");
    });

    it("Should NOT transfer - from balance", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);
      const value = 1_000_000n;
      
      const instance = protocoin.connect(otherAccount);

      await expect(instance.transferFrom(otherAccount.address, otherAccount.address, value))
            .to
            .be
            .revertedWith("Saldo insuficiente.");
    });

    it("Should NOT transfer from", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);
      const value = 1_000_000n;
      
      const instance = protocoin.connect(otherAccount);

      await expect(instance.transferFrom(owner.address, otherAccount.address, value))
            .to
            .be
            .revertedWith("Saldo permitido insuficiente.");
    });

    it("Should NOT transfer from - no allowance limit", async function () {
      const { protocoin, owner, otherAccount } = await loadFixture(deployFixture);
      const value = 1_000_000n;

      await protocoin.aprove(otherAccount.address, 1_000_000);
      const instance = protocoin.connect(otherAccount);

      await expect(instance.transferFrom(owner.address, otherAccount.address, value + 10n))
            .to
            .be
            .revertedWith("Saldo permitido insuficiente.");
    });
});
