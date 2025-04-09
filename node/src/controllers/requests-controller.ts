import { Request, Response } from "express";
import { requests } from "../models";

export async function createRequest(req: Request, res: Response) {
  try {
    const newRequest = await requests.create({
      subject: req.body.subject as string | undefined,
      message: req.body.message as string | undefined,
    });
    res.status(201).json(newRequest);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function readRequests(req: Request, res: Response) {
  try {
    const reqs = await requests.read(
      req.query.date as string | undefined,
      req.query.start as string | undefined,
      req.query.end as string | undefined,
    );

    res.json(reqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteRequest(req: Request, res: Response) {
  try {
    await requests.cancel(Number(req.params.id), req.body.cancellation_reason);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function cancelAllPending(req: Request, res: Response) {
  try {
    await requests.destroy();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function moveToPending(req: Request, res: Response) {
  try {
    await requests.moveToPending(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error during request update" });
  }
}

export async function moveFromPendingToFinished(req: Request, res: Response) {
  try {
    if (await requests.isPending(Number(req.params.id))) {
      await requests.mvToFinished(Number(req.params.id), req.body.response);
      res.status(204).end();
      return;
    }

    res.status(400).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
