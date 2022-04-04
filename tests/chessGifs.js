const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log(" Starting test...")

  // Create and set the provider. here it is set to local environment
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ChessGifs; //that's our program
  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });
  console.log(" Your transaction signature", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log(' GIF Count', account.totalGifs.toString())


  await program.rpc.addGif('https://media.giphy.com/media/Y2hzKCys8H5KWlCrfV/giphy.gif', { 
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    }
  });
  
  // Call the account.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log(' GIF Count', account.totalGifs.toString())

  // Access gif_list on the account!
  console.log(' GIF List', account.gifList)
}

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