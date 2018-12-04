const express = require('express');
const http = require('http');
const url = require('url'); // This currently not in use..
const WebSocket = require('ws');
const path = require('path');
const NUM_ITEMS = 100;
const MESSAGES_PER_SECOND = 100;

const app = express();

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function callHandlerEveryN(handler, durationMs) {
  let pendingTimeout = null;

  (function helper() {
    const startTime = Date.now();
    handler();
    pendingTimeout = setTimeout(helper, Math.max(0, durationMs + startTime - Date.now()));
  })();

  return function destroy() {
    clearTimeout(pendingTimeout);
  };
}

// This can be const, since it doesn't make the values within the array immutable.
// (We're allowed to change the values contained within Arrays and Objects assigned via const).
const names = ["MARY", "PATRICIA", "LINDA", "BARBARA", "ELIZABETH", "JENNIFER", "MARIA", "SUSAN", "MARGARET", "DOROTHY", "LISA", "NANCY", "KAREN", "BETTY", "HELEN", "SANDRA", "DONNA", "CAROL", "RUTH", "SHARON", "MICHELLE", "LAURA", "SARAH", "KIMBERLY", "DEBORAH", "JESSICA", "SHIRLEY", "CYNTHIA", "ANGELA", "MELISSA", "BRENDA", "AMY", "ANNA", "REBECCA", "VIRGINIA", "KATHLEEN", "PAMELA", "MARTHA", "DEBRA", "AMANDA", "STEPHANIE", "CAROLYN", "CHRISTINE", "MARIE", "JANET", "CATHERINE", "FRANCES", "ANN", "JOYCE", "DIANE", "ALICE", "JULIE", "HEATHER", "TERESA", "DORIS", "GLORIA", "EVELYN", "JEAN", "CHERYL", "MILDRED", "JAMES", "JOHN", "ROBERT", "MICHAEL", "WILLIAM", "DAVID", "RICHARD", "CHARLES", "JOSEPH", "THOMAS", "CHRISTOPHER", "DANIEL", "PAUL", "MARK", "DONALD", "GEORGE", "KENNETH", "STEVEN", "EDWARD", "BRIAN", "RONALD", "ANTHONY", "KEVIN", "JASON", "MATTHEW", "GARY", "TIMOTHY", "JOSE", "LARRY", "JEFFREY", "FRANK", "SCOTT", "ERIC", "STEPHEN", "ANDREW", "RAYMOND", "GREGORY", "JOSHUA", "JERRY", "DENNIS", "WALTER", "PATRICK", "PETER", "HAROLD", "DOUGLAS", "HENRY", "CARL", "ARTHUR", "RYAN", "ROGER", "JOE", "JUAN", "JACK", "ALBERT", "JONATHAN"];

function createRandomName() {
  return names[Math.floor(Math.random() * names.length)] + ' ' + names[Math.floor(Math.random() * names.length)];
}

wss.on('connection', function (ws) {
  let destroy;

  ws.on('message', function (message) {
    if (message === 'init') {
      destroy = callHandlerEveryN(function () {
        if (ws.readyState === 1) {
          ws.send(JSON.stringify({
            id: Math.floor(Math.random() * NUM_ITEMS),
            value: Math.floor(Math.random() * NUM_ITEMS),
            name: createRandomName()
          }));
        }
      }, (1000 / MESSAGES_PER_SECOND));
    }
  });

  ws.on('close', function () {
    if (destroy) {
      destroy();
      destroy = null;
    }
  });
});

server.listen(7770, function () {
  console.log('Listening on %d', server.address().port);
});
