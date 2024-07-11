use wasm_bindgen::prelude::*;
use std::alloc::{self, Layout};
use std::ptr;
use std::slice;


// Define Gaussian data structure
#[wasm_bindgen]
pub struct Gaussian {
    view_projection_matrix: *mut f32,
    positions: *mut f32,
    opacities: *mut f32,
    colors: *mut f32,
    cov_a: *mut f32,
    cov_b: *mut f32,
    position_data: *mut f32,
    color_data: *mut f32,
    opactiy_data: *mut f32,
    cov_data: *mut f32,
    size_ptr: *mut i32,
    depth_index_ptr: *mut usize,
    counts_ptr: *mut usize,
    starts_ptr: *mut usize,
    sort_size: usize,
    count: usize,
}


#[wasm_bindgen]
impl Gaussian {

    // Allocate memory for the Gaussian data
    pub fn new(count: usize, position_src: &[f32], color_src: &[f32], opacity_src: &[f32], cov_src: &[f32]) -> Gaussian {

        let view_projection_matrix = Self::alloc_float_array(16);

        let positions = Self::alloc_float_array(count * 3);
        let colors = Self::alloc_float_array(count * 3);
        let opacities = Self::alloc_float_array(count);
        let cov_a = Self::alloc_float_array(count * 3);
        let cov_b = Self::alloc_float_array(count * 3);

        let position_data = Self::alloc_float_array(count * 3);
        let color_data = Self::alloc_float_array(count * 3);
        let opactiy_data = Self::alloc_float_array(count);
        let cov_data = Self::alloc_float_array(count * 6);

        let sort_size = 256 * 256;

        unsafe {
            // Copy data into newly allocated memory
            ptr::copy_nonoverlapping(position_src.as_ptr(), position_data, count * 3);
            ptr::copy_nonoverlapping(color_src.as_ptr(), color_data, count * 3);
            ptr::copy_nonoverlapping(opacity_src.as_ptr(), opactiy_data, count);
            ptr::copy_nonoverlapping(cov_src.as_ptr(), cov_data, count * 6);
        }

        let size_ptr = Self::alloc_i32_array(count);
        let depth_index_ptr = Self::alloc_usize_array(count);
        let counts_ptr = Self::alloc_usize_array(sort_size);
        let starts_ptr = Self::alloc_usize_array(sort_size);

        unsafe {
            ptr::write_bytes(size_ptr, 0, count);
            ptr::write_bytes(depth_index_ptr, 0, count);
            ptr::write_bytes(counts_ptr, 0, sort_size);
            ptr::write_bytes(starts_ptr, 0, sort_size);
        }


        Gaussian {
            view_projection_matrix,
            positions,
            opacities,
            colors,
            cov_a,
            cov_b,
            position_data,
            color_data,
            opactiy_data,
            cov_data,
            size_ptr,
            depth_index_ptr,
            counts_ptr,
            starts_ptr,
            count,
            sort_size,
        }
    }


    fn alloc_float_array(size: usize) -> *mut f32 {
        let layout = Layout::from_size_align(size * std::mem::size_of::<f32>(), std::mem::align_of::<f32>()).unwrap();
        unsafe { alloc::alloc(layout) as *mut f32 }
    }

    fn alloc_usize_array(size: usize) -> *mut usize {
        let layout = Layout::from_size_align(size * std::mem::size_of::<usize>(), std::mem::align_of::<usize>()).unwrap();
        unsafe { alloc::alloc(layout) as *mut usize }
    }

    fn alloc_i32_array(size: usize) -> *mut i32 {
        let layout = Layout::from_size_align(size * std::mem::size_of::<i32>(), std::mem::align_of::<i32>()).unwrap();
        unsafe { alloc::alloc(layout) as *mut i32 }
    }

    // Provide access to the raw pointers for JavaScript
    #[wasm_bindgen(getter)]
    pub fn vpm_ptr(&self) -> *const f32 {
        self.view_projection_matrix
    }
    #[wasm_bindgen(getter)]
    pub fn positions_ptr(&self) -> *const f32 {
        self.positions
    }

    #[wasm_bindgen(getter)]
    pub fn opacities_ptr(&self) -> *const f32 {
        self.opacities
    }

    #[wasm_bindgen(getter)]
    pub fn colors_ptr(&self) -> *const f32 {
        self.colors
    }

    #[wasm_bindgen(getter)]
    pub fn cov_a_ptr(&self) -> *const f32 {
        self.cov_a
    }

    #[wasm_bindgen(getter)]
    pub fn cov_b_ptr(&self) -> *const f32 {
        self.cov_b
    }

    // Sorting function leveraging shared memory
    // count排序， 这里本质就是从近到远排序
    pub fn sort(&mut self) {

        // 内存的不同部分
        // 共享内存
        let view_projection_matrix = unsafe { slice::from_raw_parts_mut(self.view_projection_matrix, 16) };
        let pos_slice = unsafe { slice::from_raw_parts_mut(self.positions, self.count * 3) };
        let color_slice = unsafe { slice::from_raw_parts_mut(self.colors, self.count * 3) };
        let opacity_slice = unsafe { slice::from_raw_parts_mut(self.opacities, self.count) };
        let cova_slice = unsafe { slice::from_raw_parts_mut(self.cov_a, self.count * 3) };
        let covb_slice = unsafe { slice::from_raw_parts_mut(self.cov_b, self.count * 3) };
        // 存储数据
        let position_data = unsafe { slice::from_raw_parts_mut(self.position_data, self.count * 3) };
        let color_data = unsafe { slice::from_raw_parts_mut(self.color_data, self.count * 3) };
        let opactiy_data = unsafe { slice::from_raw_parts_mut(self.opactiy_data, self.count) };
        let cov_data = unsafe { slice::from_raw_parts_mut(self.cov_data, self.count * 6) };

        // sortGaussiansByDepth

        let calc_depth = |i: usize| -> f32 {
            position_data[i * 3] * view_projection_matrix[2] +
            position_data[i * 3 + 1] * view_projection_matrix[6] +
            position_data[i * 3 + 2] * view_projection_matrix[10]
        };

        // pos_slice[0] = view_projection_matrix[2];
        // pos_slice[1] = view_projection_matrix[6];
        // pos_slice[2] = view_projection_matrix[10];

        // count
        let size_arr = unsafe { slice::from_raw_parts_mut(self.size_ptr, self.count) };
        let depth_index_arr = unsafe { slice::from_raw_parts_mut(self.depth_index_ptr, self.count) };

        // 256 * 256
        let counts_arr = unsafe { slice::from_raw_parts_mut(self.counts_ptr, self.sort_size) };
        let starts_arr = unsafe { slice::from_raw_parts_mut(self.starts_ptr, self.sort_size) };

        unsafe {
            // clear
            ptr::write_bytes(self.size_ptr, 0, self.count);
            ptr::write_bytes(self.depth_index_ptr, 0, self.count);
            ptr::write_bytes(self.counts_ptr, 0, self.sort_size);
            ptr::write_bytes(self.starts_ptr, 0, self.sort_size);
        }

        // let mut depth_values: Vec<f32> = (0..self.count).map(|i| calc_depth(i)).collect();
        // let max_depth: f32 = *depth_values.iter().max_by(|a, b| a.partial_cmp(b).unwrap()).unwrap();
        // let min_depth: f32 = *depth_values.iter().min_by(|a, b| a.partial_cmp(b).unwrap()).unwrap();
        
        let mut max_depth: i32 = std::i32::MIN;
        let mut min_depth: i32 = std::i32::MAX;

        for i in 0..self.count {
            size_arr[i] = (calc_depth(i) * 4096.0) as i32;

            max_depth = std::cmp::max(size_arr[i], max_depth);
            min_depth = std::cmp::min(size_arr[i], min_depth);
        }

        let depth_inv: f32 = (self.sort_size as f32) / ((max_depth - min_depth) as f32);

        // pos_slice[0] = min_depth as f32;
        // pos_slice[1] = max_depth as f32;
        // pos_slice[2] = (max_depth - min_depth) as f32;

        // 相当于将 深度摊到 256 * 256 大小的 表里面
        for i in 0..self.count {
            // length: count, value: 0 - 65535 (self.sort_size)
            size_arr[i] = (((size_arr[i] - min_depth) as f32) * depth_inv) as i32;
            // 规避越界情况
            if size_arr[i] as usize >= self.sort_size {
                size_arr[i] = (self.sort_size as i32) - 1;
            }

            // lenght 256 * 256, value: 0 - count
            counts_arr[size_arr[i] as usize] += 1;
        }

        for i in 1..self.sort_size {
            starts_arr[i] = starts_arr[i - 1] + counts_arr[i - 1];
        }
        
        for i in 0..self.count {
            let match_index = size_arr[i] as usize;

            depth_index_arr[starts_arr[match_index]] = i;
            starts_arr[match_index] += 1;
        }

        // end sortGaussiansByDepth

        // 排序后结果写入共享内存
        for j in 0..self.count {
            let i = depth_index_arr[j];
            pos_slice[j * 3] = position_data[i * 3];
            pos_slice[j * 3 + 1] = position_data[i * 3 + 1];
            pos_slice[j * 3 + 2] = position_data[i * 3 + 2];

            color_slice[j * 3] = color_data[i * 3];
            color_slice[j * 3 + 1] = color_data[i * 3 + 1];
            color_slice[j * 3 + 2] = color_data[i * 3 + 2];

            opacity_slice[j] = opactiy_data[i];

            cova_slice[j * 3] = cov_data[i * 6];
            cova_slice[j * 3 + 1] = cov_data[i * 6 + 1];
            cova_slice[j * 3 + 2] = cov_data[i * 6 + 2];

            covb_slice[j * 3] =  cov_data[i * 6 + 3];
            covb_slice[j * 3 + 1] = cov_data[i * 6 + 4];
            covb_slice[j * 3 + 2] = cov_data[i * 6 + 5];
        }
    }
}

impl Drop for Gaussian {
    fn drop(&mut self) {
        unsafe {
            std::alloc::dealloc(self.positions as *mut u8, std::alloc::Layout::new::<f32>());
            std::alloc::dealloc(self.opacities as *mut u8, std::alloc::Layout::new::<f32>());
            std::alloc::dealloc(self.colors as *mut u8, std::alloc::Layout::new::<f32>());
            std::alloc::dealloc(self.cov_a as *mut u8, std::alloc::Layout::new::<f32>());
            std::alloc::dealloc(self.cov_b as *mut u8, std::alloc::Layout::new::<f32>());
        }
    }
}