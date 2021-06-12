# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :gop_server,
  ecto_repos: [GopServer.Repo]

# Configures the endpoint
config :gop_server, GopServerWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "+7sKA+MHUJ7KdEg0s5NDS71IuF3SsBNkiB7eXClWylGpeDCHx+TI4iDS0JLkmTB0",
  render_errors: [view: GopServerWeb.ErrorView, accepts: ~w(json), layout: false],
  pubsub_server: GopServer.PubSub,
  live_view: [signing_salt: "buCwR9/k"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
