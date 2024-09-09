use anchor_lang::prelude::*;

declare_id!("3wuJft2XBTfCiGbQmDeD9Up4uLqnMxHMJAMc3B872LT6");

#[program]
pub mod dex {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
