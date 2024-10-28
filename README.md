# oxy949-threeO

## How to install 
1. Copy `https://github.com/Ginzzzu/oxy949-threeO/releases/latest/download/module.json` 
2. Paste it in your Foundry VTT, wait for install
3. Enable the module in your world
4. Import the Ten Candles `Scene`, `Macro`, `Tables` and (optionally) `Jurnals` Compendiums. **Make sure to check "Keep Document IDs?" when importing!!**
5. Open main scene. Interact with a candles by click. Use macro to roll and adjust player's dice
5. Enjoy!

Included in this module is 1 Scene and 3 Macros (2 for the GM, 1 for the players).  The scene emulates the tabletop with candles and a bowl for burning traits. The macros allow control over the candle lights and flame in the bowl, moving dice from the players to the gm pool and reseting the pools when a scene ends, and allows the players to roll all the dice in a conflict (GM dice are included in this).

Activate the Scene once imported and use the macros as below.  Remember to give your players at least limited access to the **Roll Player Dice** macro.

## Macros
### Ten Candles
Clicking the macro opens a small dialog.

**Each Number** toggles the lights above a corresponding candle in the scene, allowing it to be exinguished or lit. It also changes the number in the bowl which is used to get the number of active candles.

**Bowl** toggles the lights that emulate the burning traits.

**Reset Candles** turns on all the candles and sets the active candles number to 10.

 

### Dice Pool
Clicking the macro opens a small dialog.

**Remove Player Die** moves 1 die from the players pool and into the GMs pool, this should be clicked for each 1 the players roll to move the appropriate amount of dice.

**Reset Player Pool** set the player pool of dice to the amount of active candles (the number in the bowl), and sets the GM pool to 10-(The players pool).  If 4 candles are unlit, the the player pool should be 6 and the GM pool will be 4.

 

### Roll Player Dice
Clicking the macro opens a small dialog asking if the player has acheived their moment and obtained their hope die. By default the anser is no.  After answering, all the dice are rolled: The hope die if the player answered yes, the player pool, and the GM pool.  The results are examined and the amount of successes for the player and gm are shown, the amount of 1's the players rolled in their pool (doesn't included the hope die), and based on those rolls, who should have narrative control.

 
