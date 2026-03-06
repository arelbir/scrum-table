resource "stackit_ske_cluster" "aksa-cluster" {
  project_id             = var.project_id
  name                   = "aksa"
  kubernetes_version_min = "1.28"
  node_pools = [
    {
      name               = "aksapool"
      machine_type       = "c1.3"
      os_version_min     = "2204.20240514.0"
      os_name            = "ubuntu"
      minimum            = "1"
      maximum            = "1"
      availability_zones = ["eu01-1"]
      volume_type        = "storage_premium_perf2"
    }
  ]
  maintenance = {
    enable_kubernetes_version_updates    = true
    enable_machine_image_version_updates = true
    start                                = "01:00:00Z"
    end                                  = "02:00:00Z"
  }
}

resource "stackit_ske_kubeconfig" "admin-config" {
  project_id   = var.project_id
  cluster_name = stackit_ske_cluster.aksa-cluster.name
  refresh      = true
  expiration   = "7200"
}

resource "local_file" "kubeconfig" {
  content  = stackit_ske_kubeconfig.admin-config.kube_config
  filename = "${path.module}/kubeconfig.yaml"
}

