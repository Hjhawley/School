class Widget {
};

int main() {
  4 + 5;
  int x, y;
  x - y;
  double z;
  z * x;
  x * z;

  //
  x / y;
  y / x;
  //

  x == y;
  //<=
  //!=

  Widget w, v;
  w == v; /* bool operator==(const Widget&, const Widget&)
             operator==(w, v)
             bool Widget::operator==(const Widget&)
             w.operator==(v)
           */
  w == x; /* bool operator==(const Widget&, const int&)
             operator==(w, x)
             bool operator==(const int&)
             w.operator==(x)
           */
  x == w; /* bool operator==(const int&, const Widget&)
             operator==(x, w)
             bool int::operator==(const Widget&) <--- OOPS!
             x.operator==(w) <--- does not exist
          */

  int z;
  z = (x += y);
  (x += y) += 1;

  return 0;
}
