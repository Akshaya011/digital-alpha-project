# AI Usage

## Purpose

AI assistance was used as a development aid for this project. The final code and documentation should be reviewed by a human before production use.

## Areas Assisted

- Traced the frontend transaction loading failure to the mismatch between the Flask paginated response and the frontend array expectation.
- Added frontend pagination state, numbered page navigation, a moving 10-page window, and transaction search wiring.
- Connected the demo Pay Bill button to a Flask endpoint with processing, success, and error states.
- Drafted setup, API, deployment, troubleshooting, assumptions, and technical-decision documentation.
- Added the PostgreSQL schema file and aligned it with `seed.py` and `transactions.json`.

## Verification Performed

- Ran `npm run build` in `frontend`.
- Ran `npm run lint` in `frontend`.
- Ran `python3 -m py_compile backend/app.py`.
- Checked changed files with editor diagnostics and `git diff --check` where applicable.

## Human Review Required

- Confirm the deployed frontend URL and add it to the README if it becomes available.
- Replace the simulated bill-payment endpoint with a real, authenticated payment workflow before handling money.
- Add authentication, authorization, rate limiting, and input validation before public deployment.
- Review database indexes and constraints against expected production traffic.
- Validate the deployment environment, CORS origin policy, and database secret rotation.

## Limitations

AI did not independently verify payment settlement, production deployment health, or the correctness of external hosting configuration. No secrets or credentials should be copied into documentation or committed to Git.
