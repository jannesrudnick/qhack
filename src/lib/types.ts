
// -------------------------------------------------------------------------------------------------
// ICommonPosition

export interface ICommonPosition {
  left: number;
  top: number;
}

// -------------------------------------------------------------------------------------------------
// ICommonRect

export interface ICommonRect extends ICommonPosition {
  width: number;
  height: number;
}
