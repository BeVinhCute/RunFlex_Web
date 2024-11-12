const app = angular.module("myApp", []);

app.controller("sanPhamController", function ($scope, $http) {
  // GET: lấy dữ liệu từ API và lưu vào $scope.sanPhams
  $http.get("http://localhost:8080/sanpham").then(
    function (response) {
      $scope.sanPhams = response.data;
      console.log(response.data); // Kiểm tra dữ liệu trả về từ API
    },
    function (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  );

  $scope.submitDatachiTietSanPham = function () {
    $http
      .post("http://localhost:8080/chitietsanpham", $scope.chiTietSanPham)
      .then(
        function (response) {
          console.log("Tạo chi tiết sản phẩm thành công");
          // Có thể thêm logic để cập nhật danh sách chi tiết sản phẩm nếu cần
        },
        function (error) {
          console.error("Lỗi khi tạo chi tiết sản phẩm:", error);
        }
      );
  };

  // GET: lấy danh mục
  $http.get("http://localhost:8080/danhmuc").then(
    function (response) {
      $scope.danhMucs = response.data; // Lưu danh mục vào scope
    },
    function (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  );

  // GET: lấy thương hiệu
  $http.get("http://localhost:8080/thuonghieu").then(
    function (response) {
      $scope.thuongHieus = response.data; // Lưu thương hiệu vào scope
    },
    function (error) {
      console.error("Lỗi khi lấy thương hiệu:", error);
    }
  );

  $scope.sanPham = {
    id: null,
    tenSanPham: "",
    trangThai: "",
    danhMuc: { id: null },
    thuongHieu: { id: null },
  };

  // Gọi API để lấy số lượng theo id
  $http.get("http://localhost:8080/chitietsanpham/slsp").then(
    function (response) {
      $scope.soLuongData = {};
      console.log(response.data); // Kiểm tra dữ liệu trả về từ API
      response.data.forEach(function (item) {
        const idSanPham = item[0];
        const tongSoLuong = item[1];
        $scope.soLuongData[idSanPham] = tongSoLuong;
      });
    },
    function (error) {
      console.error("Lỗi khi lấy dữ liệu số lượng:", error);
    }
  );

  // POST: Thêm mới sản phẩm
  $scope.submitData = function () {
    $http.post("http://localhost:8080/sanpham", $scope.sanPham).then(
      function (response) {
        console.log("Tạo thành công");
        $scope.getSanPhams(); // Cập nhật lại danh sách sau khi thêm mới

        $scope.resetForm(); // Reset form sau khi thêm mới
      },
      function (error) {
        console.error("Lỗi khi tạo:", error);
      }
    );
  };

  // Reset form
  $scope.resetForm = function () {
    $scope.sanPham = {
      id: null,
      tenSanPham: "",
      trangThai: "",
      danhMuc: { id: null },
      thuongHieu: { id: null },
    };
  };

  $scope.getSanPhams = function () {
    $http.get("http://localhost:8080/sanpham").then(
      function (response) {
        $scope.sanPhams = response.data;
      },
      function (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    );
  };

  // POST: Thêm mới danh mục
  $scope.themDanhMuc = function () {
    $http.post("http://localhost:8080/danhmuc", $scope.danhMuc).then(
      function (response) {
        console.log("Tạo thành công");
        $scope.danhMucs.push(response.data); // Cập nhật danh sách
        $scope.resetForm(); // Reset form sau khi thêm mới
      },
      function (error) {
        console.error("Lỗi khi tạo:", error);
      }
    );
  };

  // POST: Thêm mới thương hiệu
  $scope.themThuongHieu = function () {
    $http.post("http://localhost:8080/thuonghieu", $scope.thuongHieu).then(
      function (response) {
        console.log("Tạo thành công");
        $scope.thuongHieus.push(response.data); // Cập nhật danh sách
        $scope.resetForm(); // Reset form sau khi thêm mới
      },
      function (error) {
        console.error("Lỗi khi tạo:", error);
      }
    );
  };

  $scope.showAddForm = false; // Biến điều khiển form thêm sản phẩm

  // Hàm để hiện form thêm sản phẩm
  $scope.hienFormThemSanPham = function () {
    $scope.showAddForm = true;
  };

  // Hàm để ẩn form thêm sản phẩm
  $scope.anFormThemSanPham = function () {
    $scope.showAddForm = false;
  };

  $scope.sanPham = {
    id: null,
    tenSanPham: "",
    trangThai: "",
    danhMuc: { id: null },
    thuongHieu: { id: null },
  };

  // Gọi API để lấy số lượng theo id
  $http.get("http://localhost:8080/chitietsanpham/slsp").then(
    function (response) {
      $scope.soLuongData = {};
      console.log(response.data); // Kiểm tra dữ liệu trả về từ API
      response.data.forEach(function (item) {
        const idSanPham = item[0];
        const tongSoLuong = item[1];
        $scope.soLuongData[idSanPham] = tongSoLuong;
      });
    },
    function (error) {
      console.error("Lỗi khi lấy dữ liệu số lượng:", error);
    }
  );
});
