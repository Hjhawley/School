#include "Y.h"

Y::Y() : X(), mData4(2) {
}

double Y::getData2() const {
  return mData2;
}

double Y::getValue() const {
  double r = 0.0;
  if(mData3) {
    r = mData1 * mData4;
  } else {
    r = mData4 * mData4;
  }
  return r;
}
