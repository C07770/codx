public static void main(String[] args) {
		String path = "/Users/Kishan/Documents/TEST_FOLDER";
		
		//System.out.println(getList(path, 0, 5, false).toString());
		//String[] command = {"/bin/sh", "-c", "ls -t /Users/Kishan/Downloads -d $PWD/* | head -n 10 | tail -n 5"};
		String output = getList(path, "1", "100", null, null, true).toString(); 
		System.out.println(output);
	}

	private static List<FileMngtDTO> getList(String path, String start, String limit, String sort, String orderby, Boolean onlyFolders) {
		List<FileMngtDTO> result = new ArrayList<FileMngtDTO>();
		StringBuffer output = new StringBuffer();
		Process p;
		try {
			String sw = StringUtils.equalsIgnoreCase(sort, "name") ? "-x" : StringUtils.equalsIgnoreCase(sort, "size") ? "-S" : "-t";
			String op = "";
			if(onlyFolders) { sw += "F"; op=" | grep / | sed -e \"s/\\///g\"";}
			if(StringUtils.equalsIgnoreCase("desc", orderby)) sw += "r";
			
			p = Runtime.getRuntime().exec(new String[] {"/bin/sh", "-c", "ls " + path + op + " | wc -l"});
			String total = new BufferedReader(new InputStreamReader(p.getInputStream())).readLine();
			if(total != null) 
				total = total.replaceAll("\\s+",""); 
			
			start = String.valueOf(Integer.parseInt(start) + Integer.parseInt(limit) -1);
			
			String[] command = {"/bin/sh", "-c", "ls "+ sw +" "+ path + op +" | head -n "+ start +" | tail -n "+ limit};
			p = Runtime.getRuntime().exec(command);
			p.waitFor();
			BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String line = "";	
			while ((line = reader.readLine())!= null) {
				File f = new File(path +"/"+ line);
				FileMngtDTO el = new FileMngtDTO();
				el.setName(f.getName());
				el.setDate(new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss z").format(f.lastModified()));
				el.setSize(FileUtils.byteCountToDisplaySize(f.length()));
				el.setPath(f.getPath());
				el.setType(f.isFile() ? "file" : "dir");
				result.add(el);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
