import React from "react";

class Car {
  constructor(name) {
    this.brand = name;
  }

  present() {
    return 'I have a ' + this.brand;
  }
}

const myCar = new Car("Ferrari");

console.log(myCar.present())

const TestPage = () => {
  return (
    <div>
      <h2>Infor Car</h2>
      <p>Thương hiệu: {myCar.brand()}</p>
      <p>{myCar.present()}</p>
    </div>
  );
};

export default TestPage;
