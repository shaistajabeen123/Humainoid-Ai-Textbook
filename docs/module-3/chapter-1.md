--- 
sidebar_position: 1
title: 'Chapter 1: Forward Kinematics'
---

# Chapter 1: Forward Kinematics

## Introduction

Welcome to the study of **Robot Kinematics**! In simple terms, kinematics is the study of motion without considering the forces or masses that cause it. For any robotic manipulator, a fundamental requirement is to know where the end of the robot (the end-effector) is located in space. **Forward Kinematics** is the process that answers this question:

> Given the set of joint angles for the robot, where is the end-effector?

This chapter will walk you through the essential concepts needed to solve the forward kinematics problem for a serial manipulator.

## Degrees of Freedom (DOF)

The Degrees of Freedom (DOF) of a robot represent the number of independent variables required to completely define its position. For a typical serial link manipulator (an arm), the DOF is equal to the number of joints.

### Robot DOF Examples

Here are some common examples of robot Degrees of Freedom:

*   **1-DOF Robot:** A simple linear actuator that can only move back and forth along a single axis. Imagine a pneumatic cylinder pushing an object.
*   **2-DOF Planar Arm:** A robot arm with two revolute joints, allowing movement within a 2D plane. It can reach any point within its workspace (a circle or annulus), but cannot change its orientation relative to the plane.
*   **3-DOF SCARA Robot:** (Selective Compliance Assembly Robot Arm) - Typically has two parallel revolute joints for planar movement and one prismatic joint for vertical movement. This allows for reach and depth control.
*   **6-DOF Industrial Robot Arm:** This is a very common configuration for industrial manipulators. It typically has six revolute joints, providing 3 DOF for position (X, Y, Z) and 3 DOF for orientation (roll, pitch, yaw). This allows the robot to reach any point in its workspace with any desired orientation, making it highly versatile for tasks like welding, painting, and assembly.
*   **7-DOF Redundant Manipulator:** Similar to a 6-DOF arm but with an extra joint. This redundancy allows the robot to achieve a desired end-effector pose in multiple ways, which can be useful for avoiding obstacles or optimizing joint configurations.

Each joint (revolute or prismatic) contributes a degree of freedom to the robot's overall kinematic structure. The sum of these independent movements defines the total DOF of the robot.

![Robot DOF Examples](/img/lagado.svg)
*Fig 1: Different robot configurations have different DOFs. (Placeholder image)*

## Coordinate Frames and Homogeneous Transformations

To describe the position and orientation of each link in 3D space, we attach a coordinate frame to it. We start with a base frame, fixed to the ground or the robot's base, and then establish a new frame for each subsequent link.

The relationship between one frame and the next is described by a **Homogeneous Transformation Matrix**. This is a 4x4 matrix that elegantly combines both rotation and translation into a single operation.

A transformation from frame B to frame A is written as $^A_B T$ and has the following structure:

$$^A_B T = \begin\{bmatrix\}
    & & & \\
    & ^A_B R & & ^A P_\{B_ORG\} \\
    & & & \\
    0 & 0 & 0 & 1
\end\{bmatrix\}$$

Where:
- $^A_B R$ is a 3x3 rotation matrix describing the orientation of frame B relative to frame A.
- $^A P_\{B,ORG\}$ is a 3x1 vector describing the position of the origin of frame B relative to frame A.

## The Denavit-Hartenberg (D-H) Convention

The Denavit-Hartenberg (D-H) convention is a systematic method for assigning coordinate frames to each link of a serial manipulator and deriving the transformation matrices between them. While other methods exist, D-H is a classical and widely taught approach. It guarantees that the transformation from one link to the next can be described by just four parameters.

### The Four D-H Parameters

1.  **`a_i` (link length):** The distance along the common normal, from the $z_\{i-1\}$ axis to the $z_i$ axis.
2.  **`α_i` (link twist):** The angle between the $z_\{i-1\}$ and $z_i$ axes, measured about the common normal.
3.  **`d_i` (link offset):** The distance along the $z_\{i-1\}$ axis from the origin of frame (i-1) to the intersection with the common normal. This is a variable for a prismatic joint.
4.  **`θ_i` (joint angle):** The angle between the $x_\{i-1\}$ and $x_i$ axes, measured about the $z_\{i-1\}$ axis. This is a variable for a revolute joint.

### The D-H Transformation Matrix

Once you have the four parameters for a link `i`, you can construct the transformation matrix that defines frame (i) relative to frame (i-1):

$$
^\{i-1\}_i T = \text\{Rot\}_\{z, \theta_i\} \cdot \text\{Trans\}_\{z, d_i\} \cdot \text\{Trans\}_\{x, a_i\} \cdot \text\{Rot\}_\{x, \alpha_i\}
$$

This results in the following matrix:

$$
^\{i-1\}_i T = \begin\{bmatrix\}
    \cos\theta_i & -\sin\theta_i\cos\alpha_i & \sin\theta_i\sin\alpha_i & a_i\cos\theta_i \\
    \sin\theta_i & \cos\theta_i\cos\alpha_i & -\cos\theta_i\sin\alpha_i & a_i\sin\theta_i \\
    0 & \sin\alpha_i & \cos\alpha_i & d_i \\
    0 & 0 & 0 & 1
\end\{bmatrix\}
$$

## The Forward Kinematics Algorithm

The overall process is as follows:

1.  **Assign Frames:** For an N-DOF robot, assign coordinate frames (0) (base) through (N) (end-effector) according to the D-H convention.
2.  **Create D-H Parameter Table:** For each link (from 1 to N), determine the four D-H parameters (`a`, `α`, `d`, `θ`).
3.  **Calculate Individual Transformation Matrices:** For each link `i`, plug its D-H parameters into the $^\{i-1\}_i T$ matrix formula.
4.  **Chain the Matrices:** The final transformation from the base frame (0) to the end-effector frame (N) is found by multiplying the individual matrices together.

$$
^0_N T = ^0_1 T \cdot ^1_2 T \cdot \dots \cdot ^\{N-1\}_N T
$$

The resulting $^0_N T$ matrix will contain the position and orientation of the end-effector in the top-right 3x1 vector and top-left 3x3 sub-matrix, respectively.

In the next chapter, we will tackle the opposite problem: Inverse Kinematics.
