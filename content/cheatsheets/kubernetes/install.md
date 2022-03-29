---
title: Installation
linktitle: Installation
type: book
date: "2022-03-26T00:00:00+01:00"
tags:
  - Docker
  - Kubernetes
# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 10
---

Building a Kubernetes 1.23 Cluster with kubeadm

<!--more-->
### Overview

In this cheatsheet we will be building a new Kubernetes cluster. The setup we would end up would look like the following:

![](/images/uploads/Building_a_Kubernetes_1.23_Cluster_with_Kubeadm.png)

### Install Packages
1. Log into the Control Plane Node and create configuration file for ```containerd```
    > Note: The following steps must be performed on all three nodes.

    ```
    cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
    overlay
    br_netfilter
    EOF
    ```

2. Load modules
    ```
    sudo modprobe overlay
    sudo modprobe br_netfilter
    ```

3. Set system configurations for Kubernetes networking
    ```
    cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
    net.bridge.bridge-nf-call-iptables = 1
    net.ipv4.ip_forward = 1
    net.bridge.bridge-nf-call-ip6tables = 1
    EOF
    ```
4. Apply new settings
    ```
    sudo sysctl --system
    ```

5. Install containerd
    ```
    sudo apt-get update && sudo apt-get install -y containerd
    ```

6. Create default configuration file for containerd
    ```
    sudo mkdir -p /etc/containerd
    ```

7. Generate default containerd configuration and save to the newly created default file
    ```
    sudo containerd config default | sudo tee /etc/containerd/config.toml
    ```

8. Restart containerd to ensure new configuration file usage
    ```
    sudo systemctl restart containerd
    ```

9. Verify that containerd is running
    ```
    sudo systemctl status containerd
    ```

10. Disable swap:
    ```
    sudo swapoff -a
    ```

11. Disable swap on startup in /etc/fstab:
    ```
    sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
    ```

12. Install dependency packages:
    ```
    sudo apt-get update && sudo apt-get install -y apt-transport-https curl
    ```

13. Download and add GPG key:
    ```
    curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
    ```

14. Add Kubernetes to repository list
    ```
    cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
    deb https://apt.kubernetes.io/ kubernetes-xenial main
    EOF
    ```

15. Update package listings:
    ```
    sudo apt-get update
    ```

16. Install Kubernetes packages (Note: If you get a dpkg lock message, just wait a minute or two before trying the command again):
    ```
    sudo apt-get install -y kubelet=1.23.0-00 kubeadm=1.23.0-00 kubectl=1.23.0-00
    ```

17. Turn off automatic updates:
    ```
    sudo apt-mark hold kubelet kubeadm kubectl
    ```

18. Log into both Worker Nodes to perform previous steps.

### Initialize the Cluster

1. Initialize the Kubernetes cluster on the control plane node using kubeadm
    > Note: This is only performed on the Control Plane Node

    ```
    sudo kubeadm init --pod-network-cidr 192.168.0.0/16 --kubernetes-version 1.23.0
    ```

2. Set kubectl access:
    ```
    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config
    ```

3. Test access to cluster:
    ```
    kubectl get nodes
    ```

### Install the Calico Network Add-On

1. On the Control Plane Node, install Calico Networking:
    ```
    kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
    ```
2. Check status of the control plane node:
    ```
    kubectl get nodes
    ```

### Join the Worker Nodes to the Cluster

1. In the Control Plane Node, create the token and copy the kubeadm join command
    > NOTE:The join command can also be found in the output from kubeadm init command)
      ```
      kubeadm token create --print-join-command
      ```

2. In both Worker Nodes, paste the kubeadm join command to join the cluster. Use sudo to run it as root:
    ```
    sudo kubeadm join ...
    ```

3. In the Control Plane Node, view cluster status
    > Note: You may have to wait a few moments to allow all nodes to become ready
    ```
    kubectl get nodes
    ```

### What Next

:clap: Congratulations — you've have a working Kubernetes cluster. I would be honest this was a lot of work :sweat:.

And you would want these steps to be **repeatable**, **predictable** and **version controlled** right. That's exactly what we would look at this [HowTo](/post/k8s/) guide.
