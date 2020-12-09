class Complex {
   constructor(x, y) {
      this.re = x;
      this.im = y;
   }
   static product(a, b) {
      const re = a.re * b.re - a.im * b.im;
      const im = a.re * b.im + a.im * b.re;
      return new Complex(re, im);
   }

   static add(a, b) {
      const re = a.re + b.re;
      const im = a.im + b.im;
      return new Complex(re, im);
   }
}

//! refactor this function with fft algorithm implementation
function dft(x) {
   let X = [];
   const N = x.length;
   for (let k = 0; k < x.length; k++) {
      let sum = new Complex(0, 0);
      for (let n = 0; n < N; n++) {
         const phi = (TWO_PI * k * n) / N;
         const c = new Complex(cos(phi), -sin(phi)); // This is my complex exponential
         sum = Complex.add(sum, Complex.product(x[n], c));
      }
      
      // Normalization
      sum.re = sum.re / N;  
      sum.im = sum.im / N;

      let amp = sqrt(sum.re * sum.re + sum.im * sum.im);
      let phase = atan2(sum.im, sum.re);
      let freq = k;
      X[k] = {
         re: sum.re,
         im: sum.im,
         freq: freq,
         amp: amp,
         phase: phase
      };
   }
   return X;
}