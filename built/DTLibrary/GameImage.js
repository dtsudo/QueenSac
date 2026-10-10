let getImageNames = function () {
    return [
        0 /* GameImage.SoundOn_Black */,
        1 /* GameImage.SoundOff_Black */,
        2 /* GameImage.SoundOn_White */,
        3 /* GameImage.SoundOff_White */,
        4 /* GameImage.MusicOn_Black */,
        5 /* GameImage.MusicOff_Black */,
        6 /* GameImage.MusicOn_White */,
        7 /* GameImage.MusicOff_White */,
        8 /* GameImage.WhitePawn */,
        9 /* GameImage.WhiteRook */,
        10 /* GameImage.WhiteKnight */,
        11 /* GameImage.WhiteBishop */,
        12 /* GameImage.WhiteQueen */,
        13 /* GameImage.WhiteKing */,
        14 /* GameImage.BlackPawn */,
        15 /* GameImage.BlackRook */,
        16 /* GameImage.BlackKnight */,
        17 /* GameImage.BlackBishop */,
        18 /* GameImage.BlackQueen */,
        19 /* GameImage.BlackKing */
    ];
};
let getFilename = function (image) {
    switch (image) {
        case 0 /* GameImage.SoundOn_Black */: return "Kenney/SoundOn_Black.png";
        case 1 /* GameImage.SoundOff_Black */: return "Kenney/SoundOff_Black.png";
        case 2 /* GameImage.SoundOn_White */: return "Kenney/SoundOn_White.png";
        case 3 /* GameImage.SoundOff_White */: return "Kenney/SoundOff_White.png";
        case 4 /* GameImage.MusicOn_Black */: return "Kenney/MusicOn_Black.png";
        case 5 /* GameImage.MusicOff_Black */: return "Kenney/MusicOff_Black.png";
        case 6 /* GameImage.MusicOn_White */: return "Kenney/MusicOn_White.png";
        case 7 /* GameImage.MusicOff_White */: return "Kenney/MusicOff_White.png";
        case 8 /* GameImage.WhitePawn */: return "Cburnett/WhitePawn.png";
        case 9 /* GameImage.WhiteRook */: return "Cburnett/WhiteRook.png";
        case 10 /* GameImage.WhiteKnight */: return "Cburnett/WhiteKnight.png";
        case 11 /* GameImage.WhiteBishop */: return "Cburnett/WhiteBishop.png";
        case 12 /* GameImage.WhiteQueen */: return "Cburnett/WhiteQueen.png";
        case 13 /* GameImage.WhiteKing */: return "Cburnett/WhiteKing.png";
        case 14 /* GameImage.BlackPawn */: return "Cburnett/BlackPawn.png";
        case 15 /* GameImage.BlackRook */: return "Cburnett/BlackRook.png";
        case 16 /* GameImage.BlackKnight */: return "Cburnett/BlackKnight.png";
        case 17 /* GameImage.BlackBishop */: return "Cburnett/BlackBishop.png";
        case 18 /* GameImage.BlackQueen */: return "Cburnett/BlackQueen.png";
        case 19 /* GameImage.BlackKing */: return "Cburnett/BlackKing.png";
    }
};
export { getImageNames, getFilename };
