'use strict';

System.register(['lib/util.js', 'lib/DataSet.js'], function (_export, _context) {
  var util, DataSet;
  return {
    setters: [function (_libUtilJs) {
      util = _libUtilJs.default;
    }, function (_libDataSetJs) {
      DataSet = _libDataSetJs.default;
    }],
    execute: function () {

      //
      // simulation
      //
      class NavierSim {

        constructor(width, height) {
          this.width = width;
          this.height = height;
          this.setup();
          console.log(width, height);
        }

        setup() {
          this.BOUNDS_TYPES = { DENSITY: 'DENSITY', 'V': 'V', 'U': 'U' };
          util.error = console.warn;
          this.dt = 1;
          this.solverIterations = 12;
          this.boundaryElasticity = 1;
          this.windHeading = Math.PI / 2;
          this.resetFields();
          //
          this.startTime = new Date().getTime();
          this.stepCount = 0;
          // navier sim created
        }

        indx(x, y) {
          return Math.floor(x) + Math.floor(y) * this.u.width;
        }

        getXY(ds, x, y) {
          return ds.data[Math.floor(x) + Math.floor(y) * this.u.width];
        }

        step() {
          this.addForces();
          this.velocityStep();
          this.densityStep();
          this.moveParticles();
        }

        resetFields() {
          this.dens = DataSet.emptyDataSet(this.width, this.height, Float32Array);
          this.dens_prev = DataSet.emptyDataSet(this.width, this.height, Float32Array);
          this.u = DataSet.emptyDataSet(this.width, this.height, Float32Array);
          this.v = DataSet.emptyDataSet(this.width, this.height, Float32Array);
          this.u_prev = DataSet.emptyDataSet(this.width, this.height, Float32Array);
          this.v_prev = DataSet.emptyDataSet(this.width, this.height, Float32Array);
          this.u_static = DataSet.emptyDataSet(this.width, this.height, Float32Array);
          this.v_static = DataSet.emptyDataSet(this.width, this.height, Float32Array);
          this.P = DataSet.emptyDataSet(this.width, this.height, Float32Array);
          this.DIV = DataSet.emptyDataSet(this.width, this.height, Float32Array);
          this.boundaries = DataSet.emptyDataSet(this.width, this.height, Float32Array);
          this.particles = [];
        }

        addParticle(x, y, u = 0, v = 0) {
          this.particles.push([x, y, u, v]);
        }

        moveParticles() {
          const K = 1.2;
          const dt = 1;
          let remaining = [];
          for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const x = p[0];
            const y = p[1];
            if (x > 1 && y > 1 && x < this.width - 1 && y < this.height - 1) {
              const uWater = this.u.sample(x, y, false);
              const vWater = this.v.sample(x, y, false);
              const uP = p[2];
              const vP = p[3];
              const uW = uWater - uP;
              const vW = vWater - vP;
              const dragU = Math.sign(uW) * K * Math.pow(uW, 2) / 2;
              const dragV = Math.sign(vW) * K * Math.pow(vW, 2) / 2;
              let dxdt = uP + dragU * dt;
              let dydt = vP + dragV * dt;
              const x3 = x + dxdt * dt;
              const y3 = y + dydt * dt;
              if (this.boundaries.getXY(Math.round(x), Math.round(y)) != 0) {
                //dxdt = dydt = 0
              }
              remaining.push([x3, y3, dxdt, dydt]);
            }
          }
          this.particles = remaining;
        }

        addForces() {
          for (let i = 0; i < this.u.data.length; i++) {
            if (this.u_static.data[i] !== 0) {
              this.u.data[i] = this.u_static.data[i];
            }
            if (this.v_static.data[i] !== 0) {
              this.v.data[i] = this.v_static.data[i];
            }
          }
        }

        densityStep() {
          this.addSource(this.dens, this.dens_prev);
          this.swapDensity();
          // this.diffusionStamMethod(this.dens_prev, this.dens)
          this.dens = this.dens_prev.convolve([0, 1, 0, 1, 2, 1, 0, 1, 0], 1 / 6 * this.dt);
          this.swapDensity();
          this.advect(this.dens_prev, this.dens);
        }

        velocityStep() {
          this.addSource(this.u, this.u_prev);
          this.addSource(this.v, this.v_prev);
          this.swap('u', 'u_prev');
          // this.u = this.u_prev.convolve([0, 1, 0, 1, 2, 1, 0, 1, 0], 1 / 6 * this.dt)
          this.diffusionStamMethod(this.u_prev, this.u);
          this.swap('v', 'v_prev');
          // this.v = this.v_prev.convolve([0, 1, 0, 1, 2, 1, 0, 1, 0], 1 / 6 * this.dt)
          this.diffusionStamMethod(this.v_prev, this.v);
          this.project();
          this.swap('u', 'u_prev');
          this.swap('v', 'v_prev');
          this.advect(this.u_prev, this.u);
          this.advect(this.v_prev, this.v);
          this.project();
        }

        setBoundary(ds, type) {
          const B = this.boundaries;
          if (type === this.BOUNDS_TYPES.V) {
            for (let i = 0; i < ds.width; i++) {
              for (let j = 0; j < ds.height; j++) {
                const me = this.getXY(B, i, j); // this.boundaries.getXY(i,j)
                const up = this.getXY(B, i, j + 1); // this.boundaries.getXY(i,j+1)
                const dn = this.getXY(B, i, j - 1); // this.boundaries.getXY(i,j-1)
                if (up > 0.0 || dn > 0.0) {
                  ds.setXY(i, j, -this.boundaryElasticity * ds.getXY(i, j));
                }
                if (me > 0.0) {
                  ds.setXY(i, j, 0);
                }
              }
            }
          } else if (type === this.BOUNDS_TYPES.U) {
            for (let i = 0; i < ds.width; i++) {
              for (let j = 0; j < ds.height; j++) {
                const me = this.getXY(B, i, j);
                const lf = this.getXY(B, i - 1, j); // this.boundaries.getXY(i-1,j)
                const rt = this.getXY(B, i + 1, j); // this.boundaries.getXY(i+1,j)
                if (lf > 0.0 || rt > 0.0) {
                  ds.setXY(i, j, -this.boundaryElasticity * ds.getXY(i, j));
                }
                if (me > 0.0) {
                  ds.setXY(i, j, 0);
                }
              }
            }
          } else if (type === this.BOUNDS_TYPES.DENSITY) {
            for (let i = 0; i < ds.width; i++) {
              for (let j = 0; j < ds.height; j++) {
                var isb = this.getXY(B, i, j) > 0;
                if (isb) ds.setXY(i, j, 0);
              }
            }
          }
        }

        addSource(x0, x) {
          for (var i = 0; i < x0.data.length; i++) {
            x.data[i] += x0.data[i] * this.dt;
          }
        }

        swapDensity() {
          this.swap('dens', 'dens_prev');
        }

        swap(key1, key2) {
          const tmp = this[key1];
          this[key1] = this[key2];
          this[key2] = tmp;
        }

        advect(X0, X) {
          for (var i = 0; i < X.width; i++) {
            for (var j = 0; j < X.height; j++) {
              var dudt = this.getXY(this.u, i, j) * -this.dt; // this.u.getXY(i, j) * (-this.dt)
              var dvdt = this.getXY(this.v, i, j) * -this.dt; // this.v.getXY(i, j) * (-this.dt)
              var x2 = dudt + i;
              var y2 = dvdt + j;
              if (X.inBounds(x2, y2)) {
                var val = X0.bilinear(x2, y2);
                if (this.getXY(this.boundaries, i, j) !== 0.0) {
                  X.data[this.indx(x2, y2)] = val;
                } else {
                  X.data[this.indx(i, j)] = val;
                }
                // X.setXY(i, j, val)
              } else {
                  X.setXY(i, j, 0);
                }
            }
          }
        }

        project() {
          this.projectStep1();
          this.projectStep2();
          this.projectStep3();
        }

        projectStep1() {
          var p = this.P;
          var div = this.DIV;
          var U = this.u;
          var V = this.v;
          var h = -0.5 * Math.hypot(U.width, U.height);
          for (var i = 0; i < U.width; i++) {
            for (var j = 0; j < U.height; j++) {
              var gradX = U.data[this.indx(i + 1, j)] - U.data[this.indx(i - 1, j)];
              var gradY = V.data[this.indx(i, j + 1)] - V.data[this.indx(i, j - 1)];
              div.setXY(i, j, h * (gradX + gradY));
            }
          }
          for (i = 0; i < p.data.length; i++) p.data[i] = 0;
          this.setBoundary(div, this.BOUNDS_TYPES.V);
          this.setBoundary(p, this.BOUNDS_TYPES.U);
        }

        projectStep2() {
          var p = this.P;
          var div = this.DIV;
          //
          for (var k = 0; k < this.solverIterations; k++) {
            for (var i = 1; i < p.width - 1; i++) {
              for (var j = 1; j < p.height - 1; j++) {
                var indx = this.indx(i, j);
                var val = div.data[indx];
                val = val + p.data[indx + 1] + p.data[indx - 1];
                val = val + p.data[indx - p.width] + p.data[indx + p.width];
                // var val = div.getXY(i, j) + p.getXY(i - 1, j) + p.getXY(i + 1, j) + p.getXY(i, j - 1) + p.getXY(i, j + 1)
                val = val / 4;
                p.data[indx] = val;
              }
            }
          }
          this.setBoundary(p, this.BOUNDS_TYPES.U);
          this.setBoundary(div, this.BOUNDS_TYPES.V);
        }

        projectStep3() {
          var p = this.P;
          var U = this.u;
          var V = this.v;
          var pdx, pdy, v1, v2;
          var wScale = 0.5 / U.width;
          var hScale = 0.5 / U.height;
          for (var i = 1; i < U.width - 1; i++) {
            for (var j = 1; j < U.height - 1; j++) {
              var indx = this.indx(i, j);
              pdx = p.data[this.indx(i + 1, j)] - p.data[this.indx(i - 1, j)];
              pdy = p.data[this.indx(i, j + 1)] - p.data[this.indx(i, j - 1)];
              v1 = U.data[this.indx(i, j)] - wScale * pdx;
              v2 = V.data[this.indx(i, j)] - hScale * pdy;
              U.data[indx] = v1;
              V.data[indx] = v2;
            }
          }
          this.setBoundary(U, this.BOUNDS_TYPES.U);
          this.setBoundary(V, this.BOUNDS_TYPES.V);
        }

        //
        // this is the diffuse step from the paper. Stam, Jos
        //
        diffusionStamMethod(D0, D, diff = 1) {
          const a = this.dt * diff;
          for (var k = 0; k < this.solverIterations; k++) {
            for (var i = 1; i < D.width - 1; i++) {
              for (var j = 1; j < D.height - 1; j++) {
                const val = (D0.data[this.indx(i, j)] + a * (D.data[this.indx(i - 1, j)] + D.data[this.indx(i + 1, j)] + D.data[this.indx(i, j - 1)] + D.data[this.indx(i, j + 1)])) / (1 + 4 * a);
                D.data[this.indx(i, j)] = val;
              }
            }
          }
          this.setBoundary(D, this.BOUNDS_TYPES.DENSITY);
        }

      }

      _export('default', NavierSim);
    }
  };
});