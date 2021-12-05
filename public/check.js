class Check {
  horizontal(MATRIX, PLAYER_CURRENT) {
    let points;
    points = 0;
    for (let i = 0; i < MATRIX.length; i++) {
      for (let j = 0; j < MATRIX[i].length - 1; j++) {
        if (MATRIX[i][j] !== 0 && MATRIX[i][j] === MATRIX[i][j + 1]) {
          points++;
        }
      }
      if (points > 1) {
        return PLAYER_CURRENT;
      }
      points = 0;
    }
    return 0;
  }

  vertical(MATRIX, PLAYER_CURRENT) {
    let points;
    points = 0;
    for (let i = 0; i < MATRIX.length; i++) {
      for (let j = 0; j < MATRIX[i].length - 1; j++) {
        if (MATRIX[j][i] !== 0 && MATRIX[j][i] == MATRIX[j + 1][i]) {
          points++;
        }
      }
      if (points > 1) {
        return PLAYER_CURRENT;
      }
      points = 0;
    }
    return 0;
  }

  diagonalRight(MATRIX, PLAYER_CURRENT) {
    let points;
    points = 0;
    for (let i = 0; i < MATRIX.length - 1; i++) {
      if (MATRIX[i][i] !== 0 && MATRIX[i][i] === MATRIX[i + 1][i + 1]) {
        points++;
      }
    }
    if (points > 1) {
      return PLAYER_CURRENT;
    }
    return 0;
  }

  diagonalLeft(MATRIX, PLAYER_CURRENT) {
    let points;
    points = 0;
    for (let i = 0; i < MATRIX.length - 1; i++) {
      if (
        MATRIX[i][MATRIX.length - 1 - i] !== 0 &&
        MATRIX[i][MATRIX.length - 1 - i] ===
          MATRIX[i + 1][MATRIX.length - 2 - i]
      ) {
        points++;
      }
    }
    if (points > 1) {
      return PLAYER_CURRENT;
    }
    return 0;
  }

  draw(MATRIX) {
    let points;
    points = 0;
    for (let i = 0; i < MATRIX.length; i++) {
      for (let j = 0; j < MATRIX[i].length; j++) {
        if (MATRIX[i][j] !== 0) {
          points++;
        }
      }
    }
    if (points >= MATRIX.length * MATRIX.length) {
      return 3;
    }
    return 0;
  }

  check(MATRIX, PLAYER_CURRENT) {
    let v = this.vertical(MATRIX, PLAYER_CURRENT);
    let h = this.horizontal(MATRIX, PLAYER_CURRENT);
    let dl = this.diagonalLeft(MATRIX, PLAYER_CURRENT);
    let dr = this.diagonalRight(MATRIX, PLAYER_CURRENT);
    let d = this.draw(MATRIX, PLAYER_CURRENT);

    if (v) {
      return v;
    } else if (h) {
      return h;
    } else if (dl) {
      return dl;
    } else if (dr) {
      return dr;
    } else if (d) {
      return d;
    } else {
      return 0;
    }
  }
}

export default new Check();
