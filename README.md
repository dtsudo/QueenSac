# Overview

This is a front-end for the [Queen Sacrifice Bot](https://github.com/dtsudo/Dtsudo-Queen-Sacrifice-Bot).

In this game, you play against Stockfish, but Stockfish has been modified to hang its queen. Use this to your advantage to defeat Stockfish!

# How to execute the program

The game is delivered as a static site. Host the `built` folder as a static site, and navigate to `QueenSac.html`.

# Licensing

##### Programming

The source code of this game is licensed under GPL 3.0. However, note that it uses dependencies and other assets that are licensed under different licenses.

Libraries used:
* Stockfish: see `built/Stockfish/LICENSE.txt` for more details.
* chess.js: see `src/ChessJs/LICENSE.txt` for more details.

##### Font

Font files created by:
* Metaflop, Simon Egli, Marco Mueller, Alexis Reigel
* Roboto Project Authors

See the `built/Data/Font/` folder for more details -- a `license.txt` file is located in each subfolder.

##### Images

Image files were created by:
* Cburnett
* Kenney

See the `built/Data/Images/` folder for more details -- a `license.txt` file is located in each subfolder.

##### Sound effects

Sound effects were created by:
* Kenney

See the `built/Data/Sound/` folder for more details -- a `license.txt` file is located in each subfolder.

##### Music

Music tracks were created by:
* rezoner

See the `built/Data/Music/` folder for more details -- a `license.txt` file is located in each subfolder.

# How to compile the source code

The game is written in TypeScript. TypeScript uses the `tsconfig.json` file to determine the configuration settings for this project; notably, this file specifies that the source code is located in the `src` folder, and the output should be written to the `built` folder.

Install TypeScript and run the TypeScript compiler; this will compile the source code (i.e. the `.ts` files in the `src` folder) and create the corresponding javascript files.
