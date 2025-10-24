const app = express();
import express from "express";
import { clients } from "./data/clients.js";
const port = 3130;

// endpoint 1 y 3.
app.get("/cuentas", (req, res) => {
  const { id, client, gender } = req.query;

  if (id || client || gender) {
    let results = [];
    if (id) {
      results = clients.filter((account) => account._id === id);
    } else if (client) {
      const queryLower = client.toLowerCase();
      results = clients.filter((account) => account.client.toLowerCase() === queryLower);
    } else if (gender) {
      const queryLower = gender.toLowerCase();
      results = clients.filter(
        (account) => account.gender.toLowerCase() === queryLower
      );
    }

    let response;
    if (results.length === 1) {
      response = {
        found: true,
        account: results[0],
      };
    } else if (results.length > 1) {
      response = {
        found: true,
        data: results,
      };
    } else {
      response = {
        found: false,
        data: "Cuentas no encontradas.",
      };
    }
    res.send(response);
  } else {
    const response = {
      count: clients.length,
      data: clients,
    };
    res.send(response);
  }
});

// endpoint 2.
app.get("/cuentas/:id", (req, res) => {
  const { id } = req.params;
  const client = clients.find((b) => b._id === id);
  const response = {
    finded: !!client,
    account: client || "Cuenta no encontrada.",
  };
  res.send(response);
});

// endpoint 4.
app.get("/cuentasBalance", (req, res) => {
  const activeAccounts = clients.filter((account) => account.isActive === true);
  const active = activeAccounts.length > 0;
  let totalBalance = 0;

  if (active) {
    totalBalance = activeAccounts.reduce((sum, account) => {
      const balance = parseFloat(account.balance.replace(/[$,]/g, ""));
      return sum + balance;
    }, 0);
  }

  const response = {
    status: active,
    accountBalance: totalBalance
  };

  res.send(response);
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
