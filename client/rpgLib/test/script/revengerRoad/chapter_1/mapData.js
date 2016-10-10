/**
 * Created by wgw on 2016/5/1.
 */
define(function(){
    return {
        width:1000,
        height:1000,
        xNum:20,
        yNum:20,
        dataArray:[0,0,19.599999999999998,39.19999999999999,54.599999999999994,71.60000000000001,76.19999999999996,68.39999999999998,48.2,15.6,0,0,0,0,0,0,0,0,0,0,0,13.999999999999998,37.599999999999994,61.39999999999998,90.80000000000008,109.80000000000007,120.60000000000001,116.19999999999999,96.59999999999995,61.79999999999998,23,0,0,0,0,0,0,0,0,0,0,22.4,51.400000000000006,85.20000000000002,117.40000000000009,143.40000000000006,163.20000000000002,164.19999999999993,146.40000000000012,109.79999999999997,57.19999999999998,17,0,0,0,0,0,0,0,0,0,25.200000000000006,56.8,98.59999999999997,135.8,174.40000000000006,201.20000000000002,206.39999999999995,189.9999999999999,151.99999999999997,92.40000000000003,42.59999999999998,4.999999999999999,0,0,0,0,0,0,0,0,22.4,53.8,98.79999999999997,
        148.00000000000003,201.40000000000003,235.20000000000007,243.8,227.19999999999985,185.39999999999998,121.2000000000001,67.6,16.999999999999996,0,0,0,0,0,0,0,0,13.999999999999998,42.4,85.79999999999993,155.39999999999998,221.4,255,255,251.3999999999999,205.39999999999998,142.6000000000001,85.00000000000006,30.400000000000006,0,0,0,0,0,0,0,0,0,22.599999999999998,64.59999999999998,153,224.00000000000006,255,255,255,208,154.2000000000001,92.60000000000004,39.40000000000001,0,0,0,0,0,0,0,0,0,0,35.2,129.59999999999997,201.6000000000001,247.19999999999993,255,242.40000000000003,211.59999999999997,160.00000000000009,90.39999999999999,38.400000000000006,0,0,0,0,0,0,0,0,0,0,25.200000000000003,83.60000000000005,156.00000000000006,208.6,234.39999999999995,233.40000000000003,205.59999999999994,155.20000000000007,93.19999999999997,
        27.4,0,0,0,0,0,0,0,0,0,0,29.60000000000001,72.20000000000002,132.80000000000007,178.79999999999998,209.2,218.59999999999985,202.80000000000004,161.80000000000004,98.39999999999999,20.399999999999995,0,0,0,0,0,0,0,0,0,0,26.799999999999997,67.40000000000002,113.40000000000003,161.6,192.80000000000004,206.59999999999997,199.99999999999991,171.40000000000003,115.19999999999997,49.59999999999998,14.599999999999998,3.999999999999999,0,0,0,0,0,0,0,0,16.799999999999997,57.199999999999996,99.4,141.6,174.40000000000006,192.00000000000006,192.79999999999993,171.59999999999997,130.6,93.19999999999996,68.99999999999999,61.400000000000006,57.00000000000002,47.599999999999994,36.8,21,4.999999999999999,0,0,0,6.599999999999999,40.19999999999999,80.39999999999996,122.39999999999999,155.00000000000003,175.20000000000002,
        180.20000000000002,170.20000000000005,150.20000000000005,138.4000000000001,132.2000000000001,128.00000000000009,116.80000000000004,100.60000000000004,78.80000000000001,55.999999999999986,30.199999999999992,0,0,0,0.9999999999999998,21.400000000000006,57.79999999999997,96.39999999999996,128,152.79999999999995,166.6,169,169.8,176.60000000000002,178.80000000000013,173.4000000000001,158.60000000000005,140.00000000000003,113.8,85.99999999999999,55.19999999999998,0,0,0,0,6.3999999999999995,34.6,69.39999999999999,100.4,128.60000000000002,149.5999999999999,161.99999999999997,173.99999999999991,189.59999999999988,201.79999999999993,197.59999999999994,182.39999999999992,162.99999999999997,134.79999999999995,103.99999999999997,70.19999999999999,0,0,0,0,0,14,43,72.19999999999996,100.99999999999997,125.99999999999997,
        144.4,159.2,183.00000000000003,201.19999999999985,200.59999999999977,188.20000000000002,169.60000000000005,141.79999999999998,110.00000000000001,75.20000000000003,0,0,0,0,0,0,18.4,42.59999999999999,67.99999999999997,93.39999999999999,114.20000000000002,131.59999999999997,159.7999999999999,176.99999999999991,182.39999999999995,175.99999999999991,159.79999999999995,134.79999999999995,103.99999999999997,70.19999999999999,0,0,0,0,0,0,0,13,32.19999999999999,55.59999999999999,76.4,94.60000000000005,115.00000000000009,137.60000000000014,147.2000000000001,145.80000000000004,133.60000000000002,113.8,85.99999999999999,55.19999999999998,0,0,0,0,0,0,0,0,4.999999999999999,14.799999999999999,31.19999999999999,46.59999999999999,61.79999999999998,82.40000000000006,99.0000000000001,103.20000000000005,96.60000000000004,
        78.80000000000001,55.999999999999986,30.199999999999992,0,0,0,0,0,0,0,0,0,0,1.9999999999999996,8.2,16.599999999999998,27.200000000000003,43.20000000000001,51.40000000000002,47.599999999999994,36.8,21,4.999999999999999],"cachedPix":[12,15,183.00000000000003,13,12,132.2000000000001,13,13,178.80000000000013,13,14,201.79999999999993,13,15,201.19999999999985,13,16,176.99999999999991,13,17,137.60000000000014,13,18,82.40000000000006,14,11,61.400000000000006,14,12,128.00000000000009,14,13,173.4000000000001,14,14,197.59999999999994,14,15,200.59999999999977,14,16,182.39999999999995,14,17,147.2000000000001,14,18,99.0000000000001,14,19,43.20000000000001,15,11,57.00000000000002,15,12,116.80000000000004,15,13,158.60000000000005,15,14,182.39999999999992,15,15,188.20000000000002,15,16,175.99999999999991,15,17,
        145.80000000000004,15,18,103.20000000000005,15,19,51.40000000000002,16,11,47.599999999999994,16,12,100.60000000000004,16,13,140.00000000000003,16,14,162.99999999999997,16,15,169.60000000000005,16,16,159.79999999999995,16,17,133.60000000000002,16,18,96.60000000000004,16,19,47.599999999999994,17,10,0,17,11,36.8,17,12,78.80000000000001,17,13,113.8,17,14,134.79999999999995,17,15,141.79999999999998,17,16,134.79999999999995,17,17,113.8,17,18,78.80000000000001,17,19,36.8,18,11,21,18,12,55.999999999999986,18,13,85.99999999999999,18,14,103.99999999999997,18,15,110.00000000000001,18,16,103.99999999999997,18,17,85.99999999999999,18,18,55.999999999999986,18,19,21,19,11,4.999999999999999,19,12,30.199999999999992,19,13,55.19999999999998,19,14,70.19999999999999,19,15,75.20000000000003,19,16,70.19999999999999,19,17,55.19999999999998,19,18,30.199999999999992,19,19,4.999999999999999]}
})