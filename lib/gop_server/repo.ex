defmodule GopServer.Repo do
  use Ecto.Repo,
    otp_app: :gop_server,
    adapter: Ecto.Adapters.Postgres
end
