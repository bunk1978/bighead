import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "./CompanyList.css";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  TableSortLabel,
  Typography,
  TextField
} from "@material-ui/core";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries,
  VertialBarSeriesCanvas,
  HorizontalGridLines,
  LineSeries
} from "react-vis";
const styles = theme => ({
  root: {
    maxWidth: 1000,
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 1000
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300
  }
});

const GET_COMPANY = gql`
  query companyPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_CompanyOrdering]
    $filter: _CompanyFilter
  ) {
    Company(
      first: $first
      offset: $offset
      orderBy: $orderBy
      filter: $filter
    ) {
      name
      numberAddresses
      numberOfferings
      startDate
      endDate
      offeringDate
      offeringAmount
    }
  }
`;

function CompanyList(props) {
  const { classes } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterState, setFilterState] = React.useState({ companyFilter: "" });

  const getFilter = () => {
    return filterState.companyFilter.length > 0
      ? { name_contains: filterState.companyFilter }
      : {};
  };

  const { loading, data, error } = useQuery(GET_COMPANY, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      orderBy: orderBy + "_" + order,
      filter: getFilter()
    }
  });

  const handleSortRequest = property => {
    const newOrderBy = property;
    let newOrder = "desc";

    if (orderBy === property && order === "desc") {
      newOrder = "asc";
    }

    setOrder(newOrder);
    setOrderBy(newOrderBy);
  };

  const handleFilterChange = filterName => event => {
    const val = event.target.value;

    setFilterState(oldFilterState => ({
      ...oldFilterState,
      [filterName]: val
    }));
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h2" gutterBottom>
        Company List
      </Typography>
      <TextField
        id="search"
        label="Company Name Contains"
        className={classes.textField}
        value={filterState.companyFilter}
        onChange={handleFilterChange("companyFilter")}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.input
        }}
      />
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}
      {data && !loading && !error && (
        <div>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell
                  key="name"
                  sortDirection={orderBy === "name" ? order : false}
                >
                  <Tooltip
                    title="Sort"
                    placement="bottom-start"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={order}
                      onClick={() => handleSortRequest("name")}
                    >
                      Name
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell
                  key="numberAddresses"
                  sortDirection={orderBy === "numberAddresses" ? order : false}
                >
                  <Tooltip
                    title="Sort"
                    placement="bottom-start"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === "numberAddresses"}
                      direction={order}
                      onClick={() => handleSortRequest("numberAddresses")}
                    >
                      Number of Addresses
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell
                  key="numberOfferings"
                  sortDirection={orderBy === "numberOfferings" ? order : false}
                >
                  <Tooltip
                    title="Sort"
                    placement="bottom-start"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === "numberOfferings"}
                      direction={order}
                      onClick={() => handleSortRequest("numberOfferings")}
                    >
                      Number of Offerings
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell
                  key="startDate"
                  sortDirection={orderBy === "startDate" ? order : false}
                >
                  <Tooltip
                    title="Sort"
                    placement="bottom-start"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === "startDate"}
                      direction={order}
                      onClick={() => handleSortRequest("startDate")}
                    >
                      Start Date
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell
                  key="endDate"
                  sortDirection={orderBy === "endDate" ? order : false}
                >
                  <Tooltip
                    title="Sort"
                    placement="bottom-start"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === "endDate"}
                      direction={order}
                      onClick={() => handleSortRequest("endDate")}
                    >
                      End Date
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.Company.map(n => {
                return (
                  <TableRow key={n.name}>
                    <TableCell component="th" scope="row">
                      {n.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {n.numberAddresses}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {n.numberOfferings}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {n.startDate}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {n.endDate}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <XYPlot xType="ordinal" width={1000} height={500}>
            <HorizontalGridLines />
            <VerticalBarSeries
              data={data.Company.map(n => ({
                x: n.offeringDate,
                y: n.offeringAmount
              }))}
            />
            <XAxis />
            <YAxis />
          </XYPlot>
        </div>
      )}
    </Paper>
  );
}

export default withStyles(styles)(CompanyList);
