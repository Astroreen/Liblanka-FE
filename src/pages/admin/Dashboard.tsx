import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Menu, MenuItem } from "@mui/material";
import ProductCreation from "./product/page/ProductCreation";
import ProductInformationManager from "./product/page/ProductInformationManager";
import "./Dashboard.css";
import LanguageSwitcher from "../../components/languageSwitcher/LanguageSwitcher";

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProductsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateProduct = () => {
    setActiveComponent("createProduct");
    handleMenuClose();
  };

  const handleProductInformation = () => {
    setActiveComponent("productInformation");
    handleMenuClose();
  };

  // Условный рендеринг основного контента
  const mainContent = () => {
    switch (activeComponent) {
      case "createProduct":
        return (
          <ProductCreation onCancel={() => setActiveComponent("dashboard")} />
        );
      case "productInformation":
        return <ProductInformationManager />;
      default:
        return (
          <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">{t("page.admin.dashboard.header")}</h1>
              <LanguageSwitcher />
            </div>
            <h2>{t("page.admin.dashboard.sectionTitle")}</h2>
            <div className="table-responsive small">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th scope="col">{t("page.admin.dashboard.table.header.number")}</th>
                    <th scope="col">{t("page.admin.dashboard.table.header.placeholder")}</th>
                    <th scope="col">{t("page.admin.dashboard.table.header.placeholder")}</th>
                    <th scope="col">{t("page.admin.dashboard.table.header.placeholder")}</th>
                    <th scope="col">{t("page.admin.dashboard.table.header.placeholder")}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Существующие строки таблицы остаются без изменений */}
                  <tr>
                    <td>1,001</td>
                    <td>random</td>
                    <td>data</td>
                    <td>placeholder</td>
                    <td>text</td>
                  </tr>
                  {/* ... остальные строки опущены для краткости */}
                </tbody>
              </table>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("page.admin.dashboard.title")}</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.min.css"
          rel="stylesheet"
        />
      </Helmet>

      {/* Существующие SVG символы остаются без изменений */}
      <svg xmlns="http://www.w3.org/2000/svg" className="d-none">
        {/* ... опущено для краткости */}
      </svg>

      <div className="container-fluid">
        <div className="row">
          <div className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
            <div
              className="offcanvas-md offcanvas-end bg-body-tertiary"
              tabIndex={-1}
              id="sidebarMenu"
              aria-labelledby="sidebarMenuLabel"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="sidebarMenuLabel">
                  {t("page.admin.sidebar.companyName")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  data-bs-target="#sidebarMenu"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <button
                      className="nav-link d-flex align-items-center gap-2"
                      onClick={() => (window.location.href = "/")}
                    >
                      <svg className="bi">
                        <use xlinkHref="#arrow-left-circle" />
                      </svg>
                      {t("page.admin.sidebar.backToHome")}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link d-flex align-items-center gap-2 active"
                      aria-current="page"
                      onClick={() => setActiveComponent("dashboard")}
                    >
                      <svg className="bi">
                        <use xlinkHref="#house-fill" />
                      </svg>
                      {t("page.admin.sidebar.dashboard")}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link d-flex align-items-center gap-2">
                      <svg className="bi">
                        <use xlinkHref="#file-earmark" />
                      </svg>
                      {t("page.admin.sidebar.orders")}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link d-flex align-items-center gap-2"
                      onClick={handleProductsClick}
                    >
                      <svg className="bi">
                        <use xlinkHref="#cart" />
                      </svg>
                      {t("page.admin.sidebar.products")}
                    </button>
                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleCreateProduct}>
                        {t("page.admin.sidebar.products_creation")}
                      </MenuItem>
                      <MenuItem onClick={handleProductInformation}>
                        {t("page.admin.sidebar.products_informationManager")}
                      </MenuItem>
                      <MenuItem onClick={() => { window.location.href = "/products"; }}>
                        {t("page.admin.sidebar.products_manage")}
                      </MenuItem>
                    </Menu>
                  </li>
                  {/* Остальные элементы боковой панели остаются без изменений */}
                  <li className="nav-item">
                    <button className="nav-link d-flex align-items-center gap-2">
                      <svg className="bi">
                        <use xlinkHref="#people" />
                      </svg>
                      {t("page.admin.sidebar.customers")}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link d-flex align-items-center gap-2">
                      <svg className="bi">
                        <use xlinkHref="#graph-up" />
                      </svg>
                      {t("page.admin.sidebar.reports")}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link d-flex align-items-center gap-2">
                      <svg className="bi">
                        <use xlinkHref="#puzzle" />
                      </svg>
                      {t("page.admin.sidebar.integrations")}
                    </button>
                  </li>
                </ul>

                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                  <span>{t("page.admin.sidebar.savedReports")}</span>
                  <button
                    className="link-secondary"
                    aria-label={t("page.admin.sidebar.addNewReport")}
                  >
                    <svg className="bi">
                      <use xlinkHref="#plus-circle" />
                    </svg>
                  </button>
                </h6>
                <ul className="nav flex-column mb-auto">
                  <li className="nav-item">
                    <button className="nav-link d-flex align-items-center gap-2">
                      <svg className="bi">
                        <use xlinkHref="#file-earmark-text" />
                      </svg>
                      {t("page.admin.sidebar.currentMonth")}
                    </button>
                  </li>
                  {/* ... остальные элементы опущены для краткости */}
                </ul>

                <hr className="my-3" />

                <ul className="nav flex-column mb-auto">
                  <li className="nav-item">
                    <button className="nav-link d-flex align-items-center gap-2">
                      <svg className="bi">
                        <use xlinkHref="#gear-wide-connected" />
                      </svg>
                      {t("page.admin.sidebar.settings")}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link d-flex align-items-center gap-2">
                      <svg className="bi">
                        <use xlinkHref="#door-closed" />
                      </svg>
                      {t("page.admin.sidebar.signOut")}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {mainContent()}
          </main>
        </div>
      </div>

      <script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.3.2/dist/chart.umd.js"
        integrity="sha384-eI7PSr3L1XLISH8JdDII5YN/njoSsxfbrkCTnJrzXt+ENP5MOVBxD+l6sEG4zoLp"
        crossOrigin="anonymous"
      ></script>
    </>
  );
};
